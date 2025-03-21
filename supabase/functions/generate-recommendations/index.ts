
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { location, preferences } = await req.json();
    console.log('Generating recommendations for:', { location, preferences });

    if (!location || !preferences) {
      throw new Error('Location and preferences are required');
    }

    // Enhanced prompt for better, more detailed recommendations
    const prompt = `
    You're an expert travel and location recommendation AI assistant. Generate 5 personalized attraction recommendations near ${location.name} based on the following user preferences.
    
    User's preferences:
    - Likes: ${preferences.likes.join(', ')}
    - Dislikes: ${preferences.dislikes.join(', ')}
    - Custom filters: ${preferences.customFilters.join(', ')}
    
    For each recommendation, provide:
    1. Name: The full name of the attraction
    2. Type: Categorize as one of: food, attraction, activity, entertainment, nature, shopping, cultural
    3. Description: A detailed but concise description (2-3 sentences) highlighting what makes it special and why it matches the user's preferences
    4. Duration: Estimated time needed to visit (e.g., "1 hour", "2-3 hours", "half day")
    5. Price range: Using $ symbols from $ (inexpensive) to $$$$ (luxury)
    6. Location: A brief description of where it's located relative to the city center or other landmarks
    7. Tags: 3-5 relevant tags that capture key features of the attraction
    8. Best for: Who would most enjoy this attraction (e.g., "families", "couples", "solo travelers", "history buffs")
    
    Format your response as a clean JSON array with these fields:
    [
      {
        "name": "Attraction Name",
        "type": "attraction",
        "description": "Detailed description that connects to user preferences",
        "duration": "1-2 hours",
        "price": "$$",
        "location": "Brief location description",
        "tags": ["tag1", "tag2", "tag3"],
        "bestFor": ["families", "couples"]
      },
      ...
    ]
    `;

    // Call OpenAI API with improved error handling
    console.log('Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a travel recommendation assistant that formats responses as clean JSON only. Ensure each recommendation is personalized based on user preferences and provide practical details that would help a traveler decide where to go.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    // Extract the JSON response from the content
    const content = data.choices[0].message.content;
    console.log('Raw content:', content);
    
    // Parse the JSON data from the content
    let recommendationsData;
    try {
      recommendationsData = JSON.parse(content);
      
      // Check if the data is already in the expected format
      let recommendations = Array.isArray(recommendationsData) ? 
        recommendationsData : 
        (recommendationsData.recommendations || []);
      
      // Add IDs and random image URLs to each recommendation
      recommendations = recommendations.map((rec, index) => ({
        ...rec,
        id: `ai-rec-${Date.now()}-${index + 1}`,
        // Generate a more specific image based on the location and type
        image: `https://source.unsplash.com/random/800x600?${encodeURIComponent(location.name)}+${encodeURIComponent(rec.type)}+${encodeURIComponent(rec.tags[0] || '')}`
      }));

      console.log('Processed recommendations:', recommendations.length);
      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error parsing JSON from OpenAI response:', error, 'Content:', content);
      throw new Error('Failed to parse recommendations from OpenAI');
    }
  } catch (error) {
    console.error('Error in generate-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
