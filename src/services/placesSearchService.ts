
export interface Location {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
}

class PlacesSearchService {
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

  constructor() {
    this.initServices();
  }

  initServices() {
    if (window.google?.maps?.places) {
      if (!this.autocompleteService) {
        this.autocompleteService = new window.google.maps.places.AutocompleteService();
      }
      
      if (!this.placesService) {
        const placesDiv = document.createElement('div');
        this.placesService = new window.google.maps.places.PlacesService(placesDiv);
      }
      
      if (!this.sessionToken) {
        this.sessionToken = new window.google.maps.places.AutocompleteSessionToken();
      }
    }
  }

  async searchLocations(query: string): Promise<Location[]> {
    if (!query.trim() || !this.autocompleteService || !this.placesService) return [];
    
    try {
      // Get predictions using AutocompleteService
      const { predictions } = await new Promise<{ predictions: google.maps.places.AutocompletePrediction[] }>((resolve, reject) => {
        this.autocompleteService!.getPlacePredictions(
          {
            input: query,
            types: ['geocode', '(cities)'],
            sessionToken: this.sessionToken!
          },
          (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              reject(new Error(`Autocomplete failed: ${status}`));
              return;
            }
            resolve({ predictions });
          }
        );
      });
      
      // Convert predictions to location objects with coordinates
      const places = await Promise.all(
        predictions.slice(0, 3).map(async (prediction) => {
          const placeDetails = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
            this.placesService!.getDetails(
              {
                placeId: prediction.place_id,
                fields: ['name', 'geometry', 'formatted_address'],
                sessionToken: this.sessionToken!
              },
              (place, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
                  reject(new Error(`Place details failed: ${status}`));
                  return;
                }
                resolve(place);
              }
            );
          });
          
          return {
            name: placeDetails.name || placeDetails.formatted_address || prediction.description,
            coords: {
              lat: placeDetails.geometry?.location?.lat() ?? 0,
              lng: placeDetails.geometry?.location?.lng() ?? 0
            }
          };
        })
      );
      
      // Create a new session token after getting details (as per Google's recommendations)
      this.sessionToken = new window.google.maps.places.AutocompleteSessionToken();
      
      return places;
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }

  refreshSessionToken() {
    if (window.google?.maps?.places) {
      this.sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    }
  }
}

export const placesSearchService = new PlacesSearchService();
