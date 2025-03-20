
import { Card, CardContent } from '@/components/ui/card';
import LocationSelector from '@/components/LocationSelector';

export interface LocationData {
  name: string;
  coords: { lat: number; lng: number };
}

interface LocationSectionProps {
  selectedLocation: LocationData | null;
  onLocationSelected: (location: LocationData) => void;
}

const LocationSection = ({ selectedLocation, onLocationSelected }: LocationSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Location</h2>
      <Card>
        <CardContent className="pt-6">
          <LocationSelector onLocationSelected={onLocationSelected} />
          {selectedLocation && (
            <div className="mt-4 py-2 px-3 bg-primary/10 text-primary rounded-md">
              Using: {selectedLocation.name}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSection;
