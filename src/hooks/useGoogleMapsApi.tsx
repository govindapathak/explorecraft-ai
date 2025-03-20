
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { loadGoogleMapsScript, checkGooglePlacesAvailable, checkApiKeyStatus } from '@/utils/googleMapsLoader';

export function useGoogleMapsApi() {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [apiLoadingInProgress, setApiLoadingInProgress] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initializeGoogleMapsApi = async () => {
      if (apiLoadingInProgress) return;
      
      try {
        setApiLoadingInProgress(true);
        console.log('Initializing Google Maps API');
        const { isApiLoaded: loaded, apiError: error } = await loadGoogleMapsScript();
        console.log('API loaded status:', loaded, 'Error:', error);
        setIsApiLoaded(loaded);
        
        if (error) {
          setApiError(error);
          toast({
            title: "API Error",
            description: error,
            variant: "destructive"
          });
        } else if (loaded) {
          // Verify the Places API is actually available
          const placesAvailable = checkGooglePlacesAvailable();
          if (!placesAvailable) {
            const placesError = "Google Places library not available";
            setApiError(placesError);
            setIsApiLoaded(false);
            toast({
              title: "API Error",
              description: placesError,
              variant: "destructive"
            });
            return;
          }
          
          // Check if the API key is valid
          const isKeyValid = await checkApiKeyStatus();
          setApiKeyValid(isKeyValid);
          
          if (!isKeyValid) {
            const keyError = "Google API key may have restrictions or exceeded quota";
            setApiError(keyError);
            toast({
              title: "API Key Issue",
              description: keyError,
              variant: "destructive"
            });
          } else {
            toast({
              title: "API Ready",
              description: "Google Maps Places API loaded successfully"
            });
          }
        }
      } catch (err) {
        console.error('Failed to initialize Maps API:', err);
        setApiError('Failed to initialize Google Maps API');
        setIsApiLoaded(false);
      } finally {
        setApiLoadingInProgress(false);
      }
    };

    initializeGoogleMapsApi();
  }, [retryCount]);

  const retryLoadingApi = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setApiError(null);
    setApiKeyValid(null);
    toast({
      title: "Retrying",
      description: "Attempting to reload the Google Maps API"
    });
  }, []);

  return {
    isApiLoaded,
    apiError,
    apiKeyValid,
    retryLoadingApi,
  };
}
