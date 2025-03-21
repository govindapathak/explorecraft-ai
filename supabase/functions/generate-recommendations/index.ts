
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

    // Build a prompt based on the user's location and preferences
    const prompt = `
    You're an AI travel assistant for a travel app. Generate 5 personalized attraction recommendations near ${location.name}.
    
    User's preferences:
    - Likes: ${preferences.likes.join(', ')}
    - Dislikes: ${preferences.dislikes.join(', ')}
    - Custom filters: ${preferences.customFilters.join(', ')}
    
    For each recommendation, provide:
    1. Name
    2. Type (one of: food, attraction, activity, entertainment)
    3. A brief description (2-3 sentences)
    4. Duration (e.g., "1 hour", "2-3 hours")
    5. Price range (using $ symbols, e.g., "$", "$$", "$$$")
    6. 3-5 relevant tags
    
    Format your response as a JSON array with these fields (and no additional text):
    [
      {
        "name": "Attraction Name",
        "type": "attraction",
        "description": "Brief description",
        "duration": "1-2 hours",
        "price": "$$",
        "tags": ["tag1", "tag2", "tag3"]
      },
      ...
    ]
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a travel recommendation assistant that formats responses as clean JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
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
    let recommendations;
    try {
      recommendations = JSON.parse(content);
      
      // Add IDs and random image URLs to each recommendation
      recommendations = recommendations.map((rec, index) => ({
        ...rec,
        id: `ai-rec-${index + 1}`,
        image: `https://source.unsplash.com/random/800x600?${encodeURIComponent(rec.type)}+${encodeURIComponent(rec.name.split(' ')[0])}`
      }));
    } catch (error) {
      console.error('Error parsing JSON from OpenAI response:', error);
      throw new Error('Failed to parse recommendations from OpenAI');
    }

    console.log('Processed recommendations:', recommendations.length);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
