
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { useAuth } from '@/hooks/useAuth';
import ManualLocationInput from '@/components/ManualLocationInput';

const LocationPermission = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentLocation, isLocating, error, getCurrentLocation } = useLocation();
  const [hasAttempted, setHasAttempted] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If location is already set, redirect to the next step
  useEffect(() => {
    if (currentLocation && hasAttempted) {
      toast({
        title: "Location detected",
        description: "We found your location successfully!"
      });
      // Short delay to show the success message
      const timer = setTimeout(() => {
        navigate('/preferences');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentLocation, hasAttempted, navigate]);

  const handleGetLocation = async () => {
    setHasAttempted(true);
    try {
      await getCurrentLocation();
    } catch (err) {
      console.error('Failed to get location:', err);
    }
  };

  const handleSkip = () => {
    setShowManualInput(true);
  };

  const handleManualLocationSubmit = (location: { name: string; latitude: number; longitude: number }) => {
    // Save location to localStorage for use in other components
    const locationData = {
      name: location.name,
      coords: {
        lat: location.latitude,
        lng: location.longitude
      }
    };
    
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    
    toast({
      title: "Location set",
      description: `You've set your location to ${location.name}`
    });
    
    // Navigate to preferences page
    setTimeout(() => {
      navigate('/preferences');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">Share Your Location</h1>
          <p className="text-muted-foreground">
            To discover attractions near you, we need your location. 
            This helps us find the best recommendations within 30 miles of where you are.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-left">
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!showManualInput ? (
          <div className="space-y-4 pt-4">
            <Button 
              onClick={handleGetLocation} 
              className="w-full"
              size="lg"
              disabled={isLocating}
            >
              <Navigation className="mr-2 h-4 w-4" />
              {isLocating ? "Detecting Location..." : "Share My Location"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="w-full"
              size="lg"
            >
              Enter Location Manually
            </Button>
          </div>
        ) : (
          <div className="pt-4">
            <h2 className="text-lg font-medium mb-3">Enter your location</h2>
            <ManualLocationInput 
              onLocationSubmit={handleManualLocationSubmit}
              isLoading={false}
            />
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowManualInput(false)}
                size="sm"
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPermission;
