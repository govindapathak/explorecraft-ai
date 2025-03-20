
import { useCallback } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { usePlacesSearch } from '@/hooks/usePlacesSearch';
import { loadGoogleMapsScript } from '@/utils/googleMapsLoader';
import { toast } from '@/components/ui/use-toast';

export function useNearbyPlaces(searchRadius = 1500) {
  const { currentLocation } = useLocation();
  const { isApiLoaded, apiError, apiKeyValid, retryLoadingApi } = useGoogleMapsApi();
  const { places, isLoading, locationInsights, searchNearbyPlaces: fetchPlaces } = usePlacesSearch();

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

    // Check if API is loaded
    if (!isApiLoaded) {
      console.log('API not loaded, attempting to reload');
      toast({
        title: "Loading API",
        description: "Google Maps API is not ready yet. Attempting to load it now."
      });
      
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
      
      // Wait a moment to ensure the API is fully initialized
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Call the places search function with all needed parameters
    await fetchPlaces(locationToUse, isApiLoaded, apiError, apiKeyValid, searchRadius);
    
  }, [currentLocation, searchRadius, isApiLoaded, apiError, apiKeyValid, fetchPlaces]);

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
