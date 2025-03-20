
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';
import { loadGoogleMapsScript, checkGooglePlacesAvailable, checkApiKeyStatus } from '@/utils/googleMapsLoader';
import { getLocationInsights, searchNearbyAttractions } from '@/services/placesService';

export function useNearbyPlaces(searchRadius = 1500) {
  const [places, setPlaces] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [locationInsights, setLocationInsights] = useState<string | null>(null);
  const { currentLocation } = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);

  // Load Google Maps API on component mount
  useEffect(() => {
    const initializeGoogleMapsApi = async () => {
      try {
        console.log('Initializing Google Maps API');
        const { isApiLoaded: loaded, apiError: error } = await loadGoogleMapsScript();
        console.log('API loaded status:', loaded, 'Error:', error);
        setIsApiLoaded(loaded);
        
        if (error) {
          setApiError(error);
          toast({
            title: "API Error",
            description: error,
            variant: "destructive"
          });
        } else if (loaded) {
          // Verify the Places API is actually available
          const placesAvailable = checkGooglePlacesAvailable();
          if (!placesAvailable) {
            const placesError = "Google Places library not available";
            setApiError(placesError);
            setIsApiLoaded(false);
            toast({
              title: "API Error",
              description: placesError,
              variant: "destructive"
            });
            return;
          }
          
          // Check if the API key is valid
          const isKeyValid = await checkApiKeyStatus();
          setApiKeyValid(isKeyValid);
          
          if (!isKeyValid) {
            const keyError = "Google API key may have restrictions or exceeded quota";
            setApiError(keyError);
            toast({
              title: "API Key Issue",
              description: keyError,
              variant: "destructive"
            });
          }
        }
      } catch (err) {
        console.error('Failed to initialize Maps API:', err);
        setApiError('Failed to initialize Google Maps API');
        setIsApiLoaded(false);
      }
    };

    initializeGoogleMapsApi();
    
    // Clean up function
    return () => {
      setPlaces([]);
      setLocationInsights(null);
    };
  }, [retryCount]); // Add retryCount to dependencies to allow manual retry

  // Manual function to retry loading the API
  const retryLoadingApi = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setApiError(null);
    setApiKeyValid(null);
  }, []);

  // Function to search for places using either current location or manual coordinates
  const searchNearbyPlaces = useCallback(async (manualLocation?: { name: string; latitude: number; longitude: number }) => {
    // Use manual location if provided, otherwise use current location
    const locationToUse = manualLocation || (currentLocation ? {
      name: "Current Location",
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude
    } : null);

    if (!locationToUse) {
      toast({
        title: "Location required",
        description: "Please detect your location or enter a location manually",
        variant: "destructive"
      });
      return;
    }

    console.log('Search initiated with location:', locationToUse);
    
    // Check if API is loaded
    if (!isApiLoaded) {
      console.log('API not loaded, attempting to reload');
      // Try to reload the API
      const { isApiLoaded: reloaded, apiError: error } = await loadGoogleMapsScript();
      
      if (!reloaded) {
        toast({
          title: "API not ready",
          description: error || "Google Maps API failed to load. Please try refreshing the page.",
          variant: "destructive"
        });
        return;
      }
      setIsApiLoaded(true);
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
    console.log('Searching for places near:', locationToUse);
    
    try {
      // Get location insights first
      const insights = await getLocationInsights(locationToUse);
      setLocationInsights(insights);
      console.log('Location insights set:', insights);
      
      // Now search for nearby places
      const attractions = await searchNearbyAttractions(locationToUse, searchRadius);
      
      if (attractions.length > 0) {
        setPlaces(attractions);
        toast({
          title: "Nearby attractions found",
          description: `Found ${attractions.length} attractions near ${locationToUse.name}`
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
  }, [currentLocation, searchRadius, isApiLoaded, apiError, apiKeyValid]);

  return { 
    places, 
    isLoading, 
    isApiLoaded, 
    locationInsights, 
    searchNearbyPlaces, 
    apiError,
    apiKeyValid,
    retryLoadingApi
  };
}
