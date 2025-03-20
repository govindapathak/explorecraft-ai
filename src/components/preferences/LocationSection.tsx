
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LocationSelector from '@/components/LocationSelector';
import ManualLocationInput from '@/components/ManualLocationInput';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

export interface LocationData {
  name: string;
  coords: { lat: number; lng: number };
}

interface LocationSectionProps {
  selectedLocation: LocationData | null;
  onLocationSelected: (location: LocationData) => void;
}

const LocationSection = ({ selectedLocation, onLocationSelected }: LocationSectionProps) => {
  const [showManualInput, setShowManualInput] = useState(false);

  const handleManualLocationSubmit = (location: { name: string; latitude: number; longitude: number }) => {
    onLocationSelected({
      name: location.name,
      coords: { lat: location.latitude, lng: location.longitude }
    });
    setShowManualInput(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Location</h2>
      <Card>
        <CardContent className="pt-6">
          {!showManualInput ? (
            <>
              <LocationSelector 
                onLocationSelected={onLocationSelected} 
                initialLocation={selectedLocation}
                onMapError={() => setShowManualInput(true)}
              />
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualInput(true)}
                  className="w-full"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Enter Location Manually
                </Button>
              </div>
              
              {selectedLocation && (
                <div className="mt-4 py-2 px-3 bg-primary/10 text-primary rounded-md">
                  Using: {selectedLocation.name}
                </div>
              )}
            </>
          ) : (
            <>
              <ManualLocationInput 
                onLocationSubmit={handleManualLocationSubmit} 
                initialLocation={selectedLocation ? {
                  name: selectedLocation.name,
                  latitude: selectedLocation.coords.lat,
                  longitude: selectedLocation.coords.lng
                } : undefined}
              />
              <Button 
                variant="ghost" 
                onClick={() => setShowManualInput(false)} 
                className="mt-4 w-full"
              >
                Back to automatic location
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSection;
