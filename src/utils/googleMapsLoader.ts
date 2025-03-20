
// Use a valid API key with proper restrictions
const GOOGLE_MAPS_API_KEY = 'AIzaSyD7O27XaQwCczunvKe7dNI_B-AQD79RXDM';

interface GoogleMapsLoadingState {
  isApiLoaded: boolean;
  apiError: string | null;
}

export async function loadGoogleMapsScript(): Promise<GoogleMapsLoadingState> {
  try {
    // If already loaded, return success
    if (window.google?.maps?.places) {
      console.log('Google Maps Places API already loaded');
      return { isApiLoaded: true, apiError: null };
    }
    
    // If just the maps object exists but not places, we need to reload with places
    if (window.google?.maps && !window.google.maps.places) {
      console.warn('Google Maps loaded but Places library missing. Will reload with Places library');
    }
    
    await new Promise<void>((resolve, reject) => {
      // Check if script already exists but maybe failed
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`);
      if (existingScript) {
        // Remove the existing script to avoid conflicts
        existingScript.remove();
        console.log('Removed existing Google Maps script for reload');
      }
      
      const script = document.createElement('script');
      // Add loading=async for better performance as recommended by Google
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsCallback&loading=async`;
      script.async = true;
      script.defer = true;
      
      // Create global callback
      window.initGoogleMapsCallback = () => {
        console.log('Google Maps API loaded successfully via callback');
        if (!window.google?.maps?.places) {
          console.error('Places library not available in callback');
          reject(new Error('Places library not available after loading'));
          return;
        }
        delete window.initGoogleMapsCallback;
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      // Add timeout in case the script loads but callback doesn't fire
      setTimeout(() => {
        if (window.initGoogleMapsCallback) {
          console.error('Google Maps script loaded but callback not fired after timeout');
          reject(new Error('Google Maps callback timeout'));
        }
      }, 10000);
      
      document.head.appendChild(script);
      console.log('Google Maps script added to DOM with loading=async parameter');
    });

    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not available after loading');
      return { isApiLoaded: false, apiError: 'Google Places API failed to initialize' };
    }

    return { isApiLoaded: true, apiError: null };
    
  } catch (error) {
    console.error('Failed to load Google Maps script:', error);
    return { isApiLoaded: false, apiError: error instanceof Error ? error.message : 'Failed to load Google Maps API' };
  }
}

export function checkGooglePlacesAvailable(): boolean {
  const isAvailable = !!(window.google?.maps?.places);
  console.log('Google Places API available:', isAvailable);
  return isAvailable;
}

// Helper function to check if the API key is restricted or has quota issues
export function checkApiKeyStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.google?.maps) {
      resolve(false);
      return;
    }
    
    // Create a simple PlacesService request to test the API key
    const testDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(testDiv);
    
    service.findPlaceFromQuery({
      query: 'test',
      fields: ['name']
    }, (results, status) => {
      const isValid = status !== window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED && 
                     status !== window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT;
      
      console.log('API key status check:', status, 'Valid:', isValid);
      resolve(isValid);
    });
  });
}

// Declare global callback for script loading
declare global {
  interface Window {
    google: any;
    initGoogleMapsCallback?: () => void;
  }
}
