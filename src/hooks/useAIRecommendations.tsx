
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';

interface UserPreferences {
  location: {
    name: string;
    coords: { lat: number; lng: number };
  };
  likes: string[];
  dislikes: string[];
  customFilters: string[];
}

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPreferences, setLastPreferences] = useState<UserPreferences | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const generateRecommendations = async (userPreferences: UserPreferences) => {
    if (!userPreferences || !userPreferences.location) {
      toast({
        title: "Location required",
        description: "Please set your location before generating recommendations",
        variant: "destructive"
      });
      return;
    }

    // If there are no preferences selected, inform user
    if (!userPreferences.likes || userPreferences.likes.length === 0) {
      toast({
        title: "Preferences required",
        description: "Please select at least one category you like for better recommendations",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsUsingFallback(false);
    
    // Store the preferences we're using for this request
    setLastPreferences(userPreferences);

    try {
      console.log('Calling generate-recommendations with:', userPreferences);
      
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: {
          location: userPreferences.location,
          preferences: {
            likes: userPreferences.likes || [],
            dislikes: userPreferences.dislikes || [],
            customFilters: userPreferences.customFilters || []
          }
        }
      });

      if (error) {
        console.error('Error calling generate-recommendations:', error);
        throw new Error(error.message);
      }

      console.log('Recommendations received:', data);
      
      if (data && data.recommendations && Array.isArray(data.recommendations)) {
        // Ensure each recommendation has all required fields to prevent errors in RecommendationTile
        const processedRecommendations = data.recommendations.map((rec: any, index: number) => ({
          id: rec.id || `gen-rec-${index}-${Date.now()}`,
          name: rec.name || 'Unknown Attraction',
          description: rec.description || 'No description available',
          image: rec.image || 'https://source.unsplash.com/random/800x600?attraction',
          rating: typeof rec.rating === 'number' ? rec.rating : 0,
          numRatings: rec.numRatings || 0,
          priceLevel: rec.priceLevel || 0,
          types: Array.isArray(rec.types) ? rec.types : [],
          tags: Array.isArray(rec.tags) ? rec.tags : [],
          address: rec.address || rec.location || 'Location information not available',
          location: rec.location || rec.address || 'Location information not available',
          distance: rec.distance || 0,
          duration: rec.duration || '1-2 hours',
          bestFor: Array.isArray(rec.bestFor) ? rec.bestFor : [],
          price: rec.price || '$',
          type: rec.type || 'attraction'
        }));
        
        setRecommendations(processedRecommendations);
        
        // Check if we're using fallback recommendations
        if (data.isUsingFallback) {
          setIsUsingFallback(true);
          toast({
            title: "Using offline recommendations",
            description: "We're currently having issues with our AI service. We've generated some recommendations based on your preferences, but they might be less personalized.",
            variant: "default"
          });
        } else {
          toast({
            title: "AI Recommendations Generated",
            description: `Found ${processedRecommendations.length} attractions tailored to your preferences in ${userPreferences.location.name}`
          });
        }
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      
      toast({
        title: "Error generating recommendations",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Reset recommendations to empty array on error
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate using the same preferences
  const regenerateRecommendations = async () => {
    if (lastPreferences) {
      await generateRecommendations(lastPreferences);
    } else {
      toast({
        title: "No previous preferences",
        description: "Please set your preferences before regenerating",
        variant: "destructive"
      });
    }
  };

  // Clear current recommendations
  const clearRecommendations = () => {
    setRecommendations([]);
  };

  return {
    recommendations,
    isLoading,
    error,
    isUsingFallback,
    generateRecommendations,
    regenerateRecommendations,
    clearRecommendations,
    hasRecommendations: Array.isArray(recommendations) && recommendations.length > 0
  };
}
