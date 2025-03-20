
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';
import { getLocationInsights, searchNearbyAttractions } from '@/services/placesService';

export function usePlacesSearch() {
  const [places, setPlaces] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationInsights, setLocationInsights] = useState<string | null>(null);

  const searchNearbyPlaces = useCallback(async (
    location: { name: string; latitude: number; longitude: number },
    isApiLoaded: boolean,
    apiError: string | null,
    apiKeyValid: boolean | null,
    searchRadius: number
  ) => {
    if (!location) {
      toast({
        title: "Location required",
        description: "Please detect your location or enter a location manually",
        variant: "destructive"
      });
      return;
    }

    console.log('Search initiated with location:', location);
    
    if (!isApiLoaded) {
      toast({
        title: "API not ready",
        description: "Google Maps API is not loaded. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    if (apiError) {
      toast({
        title: "API Error",
        description: apiError,
        variant: "destructive"
      });
      return;
    }
    
    if (apiKeyValid === false) {
      toast({
        title: "API Key Issue",
        description: "Your Google Maps API key may have restrictions or exceeded quota limits",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Searching for places near:', location);
    
    try {
      // Get location insights first
      const insights = await getLocationInsights(location);
      setLocationInsights(insights);
      console.log('Location insights set:', insights);
      
      // Now search for nearby places
      const attractions = await searchNearbyAttractions(location, searchRadius);
      
      if (attractions.length > 0) {
        setPlaces(attractions);
        toast({
          title: "Nearby attractions found",
          description: `Found ${attractions.length} attractions near ${location.name}`
        });
      } else {
        toast({
          title: "No attractions found",
          description: "We couldn't find attractions near this location. Try expanding your search radius.",
          variant: "destructive"
        });
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      toast({
        title: "Error finding attractions",
        description: error instanceof Error ? error.message : "There was a problem connecting to Google Maps API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    places,
    isLoading,
    locationInsights,
    searchNearbyPlaces,
  };
}
