
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';

interface GooglePlacePickerProps {
  onPlaceSelected: (place: {
    name: string;
    coords: { lat: number; lng: number };
  }) => void;
  onError?: () => void;
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

const GooglePlacePicker = ({ onPlaceSelected, onError }: GooglePlacePickerProps) => {
  const placePickerRef = useRef<HTMLElement | null>(null);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { isApiLoaded, apiError, retryLoadingApi } = useGoogleMapsApi();

  // Use a ref to track if we've already triggered the error callback
  const errorTriggeredRef = useRef(false);

  useEffect(() => {
    // Check if script is already loaded
    const isScriptPresent = document.querySelector('script[src*="@googlemaps/extended-component-library"]');
    if (isScriptPresent) {
      setIsScriptLoading(false);
    }

    // Max retry attempts to prevent infinite loading
    const maxAttempts = 2;
    
    const checkComponentAvailability = setInterval(() => {
      // Check if the custom element is defined
      if (customElements.get('gmpx-place-picker')) {
        setIsComponentLoaded(true);
        setIsScriptLoading(false);
        clearInterval(checkComponentAvailability);
      } else {
        setLoadAttempts(prev => {
          const newAttempts = prev + 1;
          // If exceeded max attempts, stop checking
          if (newAttempts >= maxAttempts) {
            clearInterval(checkComponentAvailability);
            setIsScriptLoading(false);
            console.error('Failed to load place picker component after multiple attempts');
            
            // Only call the error callback if it hasn't been triggered yet
            if (onError && !errorTriggeredRef.current) {
              errorTriggeredRef.current = true;
              setTimeout(() => onError(), 0); // Use setTimeout to avoid React warnings about state updates during render
            }
            
            return newAttempts;
          }
          return newAttempts;
        });
      }
    }, 2000);

    // Cleanup interval
    return () => clearInterval(checkComponentAvailability);
  }, [onError]);

  // Trigger error callback if API loading fails
  useEffect(() => {
    if (apiError && onError && !errorTriggeredRef.current) {
      errorTriggeredRef.current = true;
      setTimeout(() => onError(), 0);
    }
  }, [apiError, onError]);

  useEffect(() => {
    if (!isComponentLoaded) return;

    const placePickerElement = placePickerRef.current;
    if (!placePickerElement) return;

    // Setup event listener for place selection
    const handlePlaceChanged = (event: any) => {
      const place = event.detail?.place;
      if (place) {
        console.log('Place selected:', place);
        
        // Automatically confirm the place when selected
        try {
          const locationData = {
            name: place.displayName || place.formattedAddress || "Selected Location",
            coords: {
              lat: place.location?.latitude || 0,
              lng: place.location?.longitude || 0
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
      }
    };

    placePickerElement.addEventListener('gmpx-placechange', handlePlaceChanged);

    return () => {
      placePickerElement.removeEventListener('gmpx-placechange', handlePlaceChanged);
    };
  }, [isComponentLoaded, onPlaceSelected]);

  const handleRetry = () => {
    retryLoadingApi();
    setLoadAttempts(0);
    setIsScriptLoading(true);
    errorTriggeredRef.current = false;
  };

  if (isScriptLoading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading place picker...</p>
      </Card>
    );
  }

  if (!isComponentLoaded && loadAttempts >= 2) {
    return (
      <Card className="p-4">
        <p className="text-destructive mb-2">Google Maps component failed to load.</p>
        <div className="flex space-x-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Retry Loading
          </Button>
        </div>
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
    </div>
  );
};

export default GooglePlacePicker;
