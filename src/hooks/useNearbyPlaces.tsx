
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';
import { loadGoogleMapsScript, checkGooglePlacesAvailable } from '@/utils/googleMapsLoader';
import { getLocationInsights, searchNearbyAttractions } from '@/services/placesService';

export function useNearbyPlaces(searchRadius = 1500) {
  const [places, setPlaces] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [locationInsights, setLocationInsights] = useState<string | null>(null);
  const { currentLocation } = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);

  // Load Google Maps API on component mount
  useEffect(() => {
    const initializeGoogleMapsApi = async () => {
      const { isApiLoaded: loaded, apiError: error } = await loadGoogleMapsScript();
      setIsApiLoaded(loaded);
      
      if (error) {
        setApiError(error);
        toast({
          title: "API Error",
          description: error,
          variant: "destructive"
        });
      }
    };

    initializeGoogleMapsApi();
    
    // Clean up function
    return () => {
      setPlaces([]);
      setLocationInsights(null);
    };
  }, []);

  // Monitor for API errors
  useEffect(() => {
    const checkApiErrors = () => {
      if (window.google?.maps && !window.google.maps.places) {
        const errorMsg = 'Google Places library failed to load';
        setApiError(errorMsg);
        toast({
          title: "API Error",
          description: errorMsg,
          variant: "destructive"
        });
      }
    };
    
    if (isApiLoaded) {
      checkApiErrors();
    }
  }, [isApiLoaded]);

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

    if (!isApiLoaded) {
      toast({
        title: "API not ready",
        description: "Google Maps API is still loading. Please try again in a moment.",
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

    setIsLoading(true);
    console.log('Searching for places near:', locationToUse);
    
    try {
      // Get location insights first
      const insights = await getLocationInsights(locationToUse);
      setLocationInsights(insights);
      
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
  }, [currentLocation, searchRadius, isApiLoaded, apiError]);

  return { places, isLoading, isApiLoaded, locationInsights, searchNearbyPlaces, apiError };
}

// Add type definition for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        places: {
          AutocompleteService: any;
          AutocompleteSessionToken: any;
          PlacesService: any;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            UNKNOWN_ERROR: string;
          };
        };
      };
    };
  }
}
