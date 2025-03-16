
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';

// Temporary API key for development - in production this should be secured
const GOOGLE_MAPS_API_KEY = 'AIzaSyD7O27XaQwCczunvKe7dNI_B-AQD79RXDM';

export function useNearbyPlaces(searchRadius = 1500) {
  const [places, setPlaces] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [locationInsights, setLocationInsights] = useState<string | null>(null);
  const { currentLocation } = useLocation();

  // Load Google Maps API on component mount
  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        if (window.google?.maps?.places) {
          setIsApiLoaded(true);
          return;
        }
        
        await new Promise<void>((resolve, reject) => {
          // Check if script already exists
          if (document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`)) {
            setIsApiLoaded(true);
            resolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            console.log('Google Maps API loaded successfully');
            setIsApiLoaded(true);
            resolve();
          };
          
          script.onerror = (error) => {
            console.error('Error loading Google Maps API:', error);
            toast({
              title: "API Error",
              description: "Failed to load Google Maps API. Please try again.",
              variant: "destructive"
            });
            reject(error);
          };
          
          document.head.appendChild(script);
        });
      } catch (error) {
        console.error('Failed to load Google Maps script:', error);
        toast({
          title: "API Error",
          description: "Failed to load Google Maps API. Please try again.",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsScript();
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

    if (!isApiLoaded) {
      toast({
        title: "API not ready",
        description: "Google Maps API is still loading. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Searching for places near:', locationToUse);
    
    try {
      const { places } = window.google.maps;
      const service = new places.PlacesService(document.createElement('div'));
      
      // Get location insights first
      const getLocationInsights = () => {
        return new Promise<string>((resolve) => {
          const textSearchRequest = {
            query: `tourist information about ${locationToUse.name}`,
            type: 'point_of_interest'
          };
          
          service.textSearch(textSearchRequest, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              const firstResult = results[0];
              let insightText = `${locationToUse.name} is `;
              
              if (firstResult.name) insightText += `home to ${firstResult.name}. `;
              if (firstResult.formatted_address) insightText += `Located at ${firstResult.formatted_address}. `;
              if (firstResult.rating) insightText += `This area has an average rating of ${firstResult.rating}/5 based on visitor reviews. `;
              if (firstResult.types && firstResult.types.length > 0) {
                const readableTypes = firstResult.types
                  .map(type => type.replace(/_/g, ' '))
                  .join(', ');
                insightText += `Known for: ${readableTypes}.`;
              }
              
              resolve(insightText);
            } else {
              resolve(`${locationToUse.name} - Explore this location and discover nearby attractions.`);
            }
          });
        });
      };
      
      const insights = await getLocationInsights();
      setLocationInsights(insights);
      
      // Now search for nearby places
      service.nearbySearch(
        {
          location: { 
            lat: locationToUse.latitude, 
            lng: locationToUse.longitude 
          },
          radius: searchRadius,
          type: 'tourist_attraction'
        },
        (results, status) => {
          console.log('Places API results:', status, results?.length);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const recommendations: Recommendation[] = results
              .filter(place => place.name && place.vicinity)
              .map((place, index) => {
                // Get photo URL if available
                const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 });
                
                return {
                  id: place.place_id || `place-${index}`,
                  name: place.name || 'Unknown Place',
                  type: 'attraction',
                  image: photoUrl || 'https://images.unsplash.com/photo-1617339860293-978cf33cce43?q=80&w=1000',
                  location: place.vicinity || 'Unknown location',
                  rating: place.rating || 4.0,
                  description: place.types?.join(', ') || 'Tourist attraction',
                  duration: '1-2 hours',
                  price: place.price_level ? '$'.repeat(place.price_level) : 'Varies',
                  tags: place.types?.map((type: string) => 
                    type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ) || ['Attraction']
                };
              });
              
            console.log('Formatted recommendations:', recommendations.length);
            setPlaces(recommendations);
            
            toast({
              title: "Nearby attractions found",
              description: `Found ${recommendations.length} attractions near ${locationToUse.name}`
            });
          } else {
            console.error('Places API error or no results:', status);
            toast({
              title: "No attractions found",
              description: "We couldn't find attractions near this location. Try expanding your search radius.",
              variant: "destructive"
            });
            setPlaces([]);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      toast({
        title: "Error finding attractions",
        description: "There was a problem connecting to Google Maps API",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [currentLocation, searchRadius, isApiLoaded]);

  return { places, isLoading, isApiLoaded, locationInsights, searchNearbyPlaces };
}

// Add type definition for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        places: {
          PlacesService: any;
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}
