
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsCallback`;
      script.async = true;
      script.defer = true;
      
      // Create global callback
      window.initGoogleMapsCallback = () => {
        console.log('Google Maps API loaded successfully via callback');
        delete window.initGoogleMapsCallback;
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      document.head.appendChild(script);
      console.log('Google Maps script added to DOM');
    });

    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not available after loading');
      return { isApiLoaded: false, apiError: 'Google Places API failed to initialize' };
    }

    return { isApiLoaded: true, apiError: null };
    
  } catch (error) {
    console.error('Failed to load Google Maps script:', error);
    return { isApiLoaded: false, apiError: 'Failed to load Google Maps API' };
  }
}

export function checkGooglePlacesAvailable(): boolean {
  const isAvailable = !!(window.google?.maps?.places);
  console.log('Google Places API available:', isAvailable);
  return isAvailable;
}

// Declare global callback for script loading
declare global {
  interface Window {
    google: any;
    initGoogleMapsCallback?: () => void;
  }
}
