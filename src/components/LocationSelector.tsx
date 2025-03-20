
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { type Location } from '@/services/placesSearchService';
import CurrentLocationButton from '@/components/location/CurrentLocationButton';
import GooglePlacePicker from '@/components/GooglePlacePicker';

interface LocationSelectorProps {
  onLocationSelected: (location: Location) => void;
}

const LocationSelector = ({ onLocationSelected }: LocationSelectorProps) => {
  const { currentLocation, isLocating, getCurrentLocation } = useLocation();
  
  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        const locationData = {
          name: "Current Location",
          coords: { lat: location.latitude, lng: location.longitude }
        };
        onLocationSelected(locationData);
        
        toast({
          title: "Using current location",
          description: "Building recommendations based on where you are",
        });
      }
    } catch (error) {
      toast({
        title: "Location access denied",
        description: "Please enable location access or search for a location",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <GooglePlacePicker onPlaceSelected={onLocationSelected} />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or use
          </span>
        </div>
      </div>
      
      <CurrentLocationButton 
        onClick={handleUseCurrentLocation}
        isLocating={isLocating}
      />
    </div>
  );
};

export default LocationSelector;
