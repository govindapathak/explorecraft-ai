
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState<LocationState | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationState | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast({
        title: "Location unavailable",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return null;
    }

    setIsLocating(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          
          setCurrentLocation(locationData);
          setIsLocating(false);
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          setError(errorMessage);
          setIsLocating(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    currentLocation,
    isLocating,
    error,
    getCurrentLocation,
  };
}
