
import { Card, CardContent } from '@/components/ui/card';
import LocationSelector from '@/components/LocationSelector';
import { type Location } from '@/services/placesSearchService';

interface LocationPromptProps {
  onLocationSelected: (location: Location) => void;
}

const LocationPrompt = ({ onLocationSelected }: LocationPromptProps) => {
  return (
    <div className="container mx-auto max-w-xl py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Discover nearby attractions</h1>
        <p className="text-muted-foreground">We need your location to find attractions near you</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <LocationSelector 
            onLocationSelected={onLocationSelected}
            initialLocation={null}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPrompt;
