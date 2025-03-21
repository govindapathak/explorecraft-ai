
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { type Location } from '@/services/placesSearchService';

export function useDiscoverLocation() {
  const { getCurrentLocation } = useLocation();
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  
  const { 
    places, 
    isLoading: isLoadingPlaces, 
    locationInsights,
    searchNearbyPlaces,
    apiError,
    retryLoadingApi
  } = useNearbyPlaces(30000); // 30km ~ 18.6 miles

  // Try to load user location automatically
  useEffect(() => {
    const tryGetLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          const locationData = {
            name: "Current Location",
            coords: { 
              lat: location.latitude, 
              lng: location.longitude 
            }
          };
          handleLocationSelected(locationData);
          setShowLocationPrompt(false);
        }
      } catch (error) {
        console.log('Could not automatically get location, showing prompt');
      }
    };
    
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        handleLocationSelected(parsedLocation);
        setShowLocationPrompt(false);
      } catch (e) {
        tryGetLocation();
      }
    } else {
      tryGetLocation();
    }
  }, []);
  
  const handleLocationSelected = (location: Location) => {
    localStorage.setItem('userLocation', JSON.stringify(location));
    setShowLocationPrompt(false);
    setUserLocation(location);
    
    // Search for nearby places when location is selected
    searchNearbyPlaces({
      name: location.name,
      latitude: location.coords.lat,
      longitude: location.coords.lng
    });
  };
  
  return {
    userLocation,
    showLocationPrompt,
    places,
    isLoadingPlaces,
    locationInsights,
    apiError,
    retryLoadingApi,
    handleLocationSelected
  };
}
