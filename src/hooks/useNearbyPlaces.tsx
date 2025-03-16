
import { useState, useEffect } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';

// Temporary API key for development - in production this should be secured
const GOOGLE_MAPS_API_KEY = 'AIzaSyD7O27XaQwCczunvKe7dNI_B-AQD79RXDM'; // This is a placeholder key

export function useNearbyPlaces(searchRadius = 1500) {
  const [places, setPlaces] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentLocation } = useLocation();

  useEffect(() => {
    if (!currentLocation) return;

    const fetchNearbyPlaces = async () => {
      setIsLoading(true);
      
      try {
        // Load Google Maps API script
        if (!window.google || !window.google.maps) {
          await loadGoogleMapsScript();
        }
        
        const { Map, places } = window.google.maps;
        const service = new places.PlacesService(document.createElement('div'));
        
        service.nearbySearch(
          {
            location: { 
              lat: currentLocation.latitude, 
              lng: currentLocation.longitude 
            },
            radius: searchRadius,
            type: 'tourist_attraction'
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              const recommendations: Recommendation[] = results
                .filter(place => place.photos && place.name && place.vicinity)
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
                
              setPlaces(recommendations);
              
              toast({
                title: "Nearby attractions found",
                description: `Found ${recommendations.length} attractions near your location`
              });
            } else {
              toast({
                title: "No attractions found",
                description: "We couldn't find attractions near your location. Try expanding your search radius.",
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
    };

    fetchNearbyPlaces();
  }, [currentLocation, searchRadius]);

  // Helper function to load Google Maps script
  const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps script failed to load'));
      
      document.head.appendChild(script);
    });
  };

  return { places, isLoading };
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
