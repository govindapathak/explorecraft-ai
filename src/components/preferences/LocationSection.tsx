
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LocationSelector from '@/components/LocationSelector';
import { Map, Sparkles, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  const [progressStage, setProgressStage] = useState<number>(0);

  // Simulate progression through AI reasoning stages during recommendation generation
  // This gives users visual feedback that something is happening
  const progressStages = [
    "Analyzing location data...",
    "Processing preferences...",
    "Finding attractions...",
    "Ranking recommendations...",
    "Finalizing results..."
  ];
  
  // Update the stage indicator every 1.2 seconds when generating
  useEffect(() => {
    if (isGeneratingRecommendations) {
      const interval = setInterval(() => {
        setProgressStage(current => {
          const next = current + 1;
          // Loop through the stages if we reach the end before completion
          return next >= progressStages.length ? 0 : next;
        });
      }, 1200);
      
      return () => clearInterval(interval);
    } else {
      // Reset when not generating
      setProgressStage(0);
    }
  }, [isGeneratingRecommendations]);

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
            <div className="mt-4 py-2 px-3 bg-primary/10 text-primary rounded-md flex items-center">
              <Map className="h-4 w-4 mr-2" />
              <span>Using: {selectedLocation.name}</span>
            </div>
          )}

          {selectedLocation && onGenerateRecommendations && (
            <div className="mt-4 space-y-3">
              <Button 
                onClick={onGenerateRecommendations} 
                className="w-full" 
                disabled={isGeneratingRecommendations}
              >
                {isGeneratingRecommendations ? (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4 animate-pulse" />
                    AI is generating recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Recommendations
                  </>
                )}
              </Button>
              
              {isGeneratingRecommendations && (
                <div className="space-y-2">
                  <Progress value={(progressStage + 1) * 20} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center animate-pulse">
                    {progressStages[progressStage]}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSection;
