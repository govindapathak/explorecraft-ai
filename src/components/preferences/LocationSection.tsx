
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LocationSelector from '@/components/LocationSelector';
import { Map, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface LocationData {
  name: string;
  coords: { lat: number; lng: number };
}

interface LocationSectionProps {
  selectedLocation: LocationData | null;
  onLocationSelected: (location: LocationData) => void;
  onGenerateRecommendations?: () => void;
  isGeneratingRecommendations?: boolean;
}

const LocationSection = ({ 
  selectedLocation, 
  onLocationSelected,
  onGenerateRecommendations,
  isGeneratingRecommendations = false
}: LocationSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Location</h2>
      <Card>
        <CardContent className="pt-6">
          <LocationSelector 
            onLocationSelected={onLocationSelected} 
            initialLocation={selectedLocation}
          />
          
          {selectedLocation && (
            <div className="mt-4 py-2 px-3 bg-primary/10 text-primary rounded-md">
              Using: {selectedLocation.name}
            </div>
          )}

          {selectedLocation && onGenerateRecommendations && (
            <Button 
              onClick={onGenerateRecommendations} 
              className="mt-4 w-full" 
              disabled={isGeneratingRecommendations}
            >
              {isGeneratingRecommendations ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Recommendations
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSection;
