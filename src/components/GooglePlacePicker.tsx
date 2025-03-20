
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GooglePlacePickerProps {
  onPlaceSelected: (place: {
    name: string;
    coords: { lat: number; lng: number };
  }) => void;
}

// Add type definitions for the extended component library
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-place-picker': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string;
        },
        HTMLElement
      >;
    }
  }
}

const GooglePlacePicker = ({ onPlaceSelected }: GooglePlacePickerProps) => {
  const placePickerRef = useRef<HTMLElement | null>(null);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    const isScriptPresent = document.querySelector('script[src*="@googlemaps/extended-component-library"]');
    if (isScriptPresent) {
      setIsScriptLoading(false);
    }

    // Max retry attempts to prevent infinite loading
    const maxAttempts = 3;
    
    const checkComponentAvailability = setInterval(() => {
      // Check if the custom element is defined
      if (customElements.get('gmpx-place-picker')) {
        setIsComponentLoaded(true);
        setIsScriptLoading(false);
        clearInterval(checkComponentAvailability);
      } else {
        setLoadAttempts(prev => {
          // If exceeded max attempts, stop checking
          if (prev >= maxAttempts) {
            clearInterval(checkComponentAvailability);
            setIsScriptLoading(false);
            console.error('Failed to load place picker component after multiple attempts');
            toast({
              title: "Component failed to load",
              description: "Please try using manual location input instead",
              variant: "destructive"
            });
            return prev;
          }
          return prev + 1;
        });
      }
    }, 2000);

    // Cleanup interval
    return () => clearInterval(checkComponentAvailability);
  }, []);

  useEffect(() => {
    if (!isComponentLoaded) return;

    const placePickerElement = placePickerRef.current;
    if (!placePickerElement) return;

    // Setup event listener for place selection
    const handlePlaceChanged = (event: any) => {
      const place = event.detail?.place;
      if (place) {
        console.log('Place selected:', place);
        setSelectedPlace(place);
      }
    };

    placePickerElement.addEventListener('gmpx-placechange', handlePlaceChanged);

    return () => {
      placePickerElement.removeEventListener('gmpx-placechange', handlePlaceChanged);
    };
  }, [isComponentLoaded]);

  const handleConfirmPlace = () => {
    if (!selectedPlace) {
      toast({
        title: "No place selected",
        description: "Please select a location first",
        variant: "destructive"
      });
      return;
    }

    try {
      const locationData = {
        name: selectedPlace.displayName || selectedPlace.formattedAddress || "Selected Location",
        coords: {
          lat: selectedPlace.location?.latitude || 0,
          lng: selectedPlace.location?.longitude || 0
        }
      };

      onPlaceSelected(locationData);
      
      toast({
        title: "Location selected",
        description: `You've selected ${locationData.name}`,
      });
    } catch (error) {
      console.error('Error processing selected place:', error);
      toast({
        title: "Error processing location",
        description: "There was a problem with the selected location",
        variant: "destructive"
      });
    }
  };

  if (isScriptLoading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading place picker...</p>
      </Card>
    );
  }

  if (!isComponentLoaded && loadAttempts >= 3) {
    return (
      <Card className="p-4">
        <p className="text-destructive mb-2">Google Maps component failed to load.</p>
        <p className="text-sm text-muted-foreground">Please use manual location input instead.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="place-picker-container w-full">
        {isComponentLoaded ? (
          <gmpx-place-picker 
            ref={placePickerRef}
            placeholder="Search for a location" 
            className="w-full"
            style={{ width: '100%' }}
          />
        ) : (
          <Card className="p-4 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-2">Initializing place picker...</p>
          </Card>
        )}
      </div>
      
      {isComponentLoaded && (
        <Button 
          onClick={handleConfirmPlace} 
          className="w-full" 
          disabled={!selectedPlace}
        >
          Confirm Location
        </Button>
      )}
    </div>
  );
};

export default GooglePlacePicker;
