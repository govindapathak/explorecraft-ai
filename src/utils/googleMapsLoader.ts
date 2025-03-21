// Use the provided API key with proper restrictions
const GOOGLE_MAPS_API_KEY = 'AIzaSyBMcrAsK9kOZK9Ja0rHjHiI5etXA3h3wqI';

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
    
    console.log('Starting Google Maps API loading process...');
    
    await new Promise<void>((resolve, reject) => {
      // Check if script already exists but maybe failed
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`);
      if (existingScript) {
        // Remove the existing script to avoid conflicts
        existingScript.remove();
        console.log('Removed existing Google Maps script for reload');
      }
      
      // Also check and remove extended component library if it exists
      const extendedLibScript = document.querySelector(`script[src*="@googlemaps/extended-component-library"]`);
      if (extendedLibScript) {
        extendedLibScript.remove();
        console.log('Removed existing Google Maps extended library for reload');
      }
      
      // Add the extended component library
      const extendedScript = document.createElement('script');
      extendedScript.type = 'module';
      extendedScript.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';
      document.head.appendChild(extendedScript);
      
      // Add the API loader element
      const apiLoader = document.createElement('gmpx-api-loader');
      apiLoader.setAttribute('key', GOOGLE_MAPS_API_KEY);
      apiLoader.setAttribute('solution-channel', 'GMP_GE_placepicker_v2');
      document.body.appendChild(apiLoader);
      
      // Load the regular Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded via onload event');
        // Check if the places library is available
        if (!window.google?.maps?.places) {
          console.error('Places library not available after script load');
          reject(new Error('Places library not available after loading'));
          return;
        }
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      // Add timeout in case the script loads but callback doesn't fire
      setTimeout(() => {
        if (!window.google?.maps?.places) {
          console.error('Google Maps script loaded but Places library not found after timeout');
          reject(new Error('Google Maps Places library timeout'));
        }
      }, 10000);
      
      document.head.appendChild(script);
      console.log('Google Maps script added to DOM');
    });

    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not available after loading');
      return { isApiLoaded: false, apiError: 'Google Places API failed to initialize' };
    }

    console.log('Successfully loaded Google Maps Places API');
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
      console.error('Cannot check API key status: Google Maps not loaded');
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
