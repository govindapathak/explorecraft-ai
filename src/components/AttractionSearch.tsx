
import { useState } from 'react';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import LocationSelector from '@/components/LocationSelector';
import ManualLocationInput from '@/components/ManualLocationInput';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const AttractionSearch = () => {
  const [searchRadius, setSearchRadius] = useState(1500);
  const { 
    isLoading, 
    isApiLoaded, 
    apiError, 
    apiKeyValid, 
    searchNearbyPlaces, 
    retryLoadingApi 
  } = useNearbyPlaces(searchRadius);

  const handleLocationSelected = (location: { name: string; coords: { lat: number; lng: number } }) => {
    searchNearbyPlaces({
      name: location.name,
      latitude: location.coords.lat,
      longitude: location.coords.lng
    });
  };

  const handleManualLocationSubmit = (location: { name: string; latitude: number; longitude: number }) => {
    searchNearbyPlaces(location);
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Find Nearby Attractions</h2>
        <p className="text-muted-foreground">Search for attractions near a location</p>
      </div>

      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Google Maps API Error</AlertTitle>
          <AlertDescription>
            {apiError}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryLoadingApi} 
                className="mt-2"
                disabled={isLoading}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry loading API
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!isApiLoaded && !apiError ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading Google Maps API...</p>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <LocationSelector onLocationSelected={handleLocationSelected} />
          <div className="text-center text-sm text-muted-foreground">or</div>
          <ManualLocationInput 
            onLocationSubmit={handleManualLocationSubmit} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {apiKeyValid === false && isApiLoaded && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Restrictions</AlertTitle>
          <AlertDescription>
            Your Google Maps API key may have domain restrictions or exceeded its quota.
            Please check your API key settings in the Google Cloud Console.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AttractionSearch;
