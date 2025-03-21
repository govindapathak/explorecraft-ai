
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

  const generateRecommendations = async (userPreferences: UserPreferences) => {
    if (!userPreferences || !userPreferences.location) {
      toast({
        title: "Location required",
        description: "Please set your location before generating recommendations",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

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
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
        toast({
          title: "AI Recommendations Generated",
          description: `Found ${data.recommendations.length} attractions tailored to your preferences`
        });
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      toast({
        title: "Error generating recommendations",
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recommendations,
    isLoading,
    error,
    generateRecommendations
  };
}
