
// Type definitions for Google APIs used in the application
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
      };
      maps: {
        Map: any;
        places: {
          AutocompleteService: any;
          AutocompleteSessionToken: any;
          PlacesService: any;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            UNKNOWN_ERROR: string;
          };
        };
      };
    };
  }
  
  // Extended component library namespace
  namespace gmpx {
    interface Place {
      displayName?: string;
      formattedAddress?: string;
      location?: {
        latitude: number;
        longitude: number;
      };
      id?: string;
      placeId?: string;
    }
  }
  
  // Custom elements
  interface HTMLElementTagNameMap {
    'gmpx-api-loader': HTMLElement & {
      key: string;
      'solution-channel': string;
    };
    'gmpx-place-picker': HTMLElement & {
      placeholder: string;
    };
  }
}

export {};
