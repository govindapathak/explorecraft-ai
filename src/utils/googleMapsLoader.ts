
// Use a valid API key with proper restrictions
const GOOGLE_MAPS_API_KEY = 'AIzaSyD7O27XaQwCczunvKe7dNI_B-AQD79RXDM';

interface GoogleMapsLoadingState {
  isApiLoaded: boolean;
  apiError: string | null;
}

export async function loadGoogleMapsScript(): Promise<GoogleMapsLoadingState> {
  try {
    if (window.google?.maps?.places) {
      return { isApiLoaded: true, apiError: null };
    }
    
    await new Promise<void>((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });

    return { isApiLoaded: true, apiError: null };
    
  } catch (error) {
    console.error('Failed to load Google Maps script:', error);
    return { isApiLoaded: false, apiError: 'Failed to load Google Maps API' };
  }
}

export function checkGooglePlacesAvailable(): boolean {
  return !!(window.google?.maps?.places);
}
