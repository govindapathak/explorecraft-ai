
import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';

interface LocationSelectorProps {
  onLocationSelected: (location: { name: string; coords: { lat: number; lng: number } }) => void;
}

const LocationSelector = ({ onLocationSelected }: LocationSelectorProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ name: string; coords: { lat: number; lng: number } }[]>([]);
  const { currentLocation, isLocating, getCurrentLocation } = useLocation();
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google Maps places services
  useEffect(() => {
    if (window.google?.maps?.places) {
      if (!autocompleteService.current) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
      
      if (!placesService.current) {
        const placesDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(placesDiv);
      }
      
      if (!sessionToken.current) {
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
      }
    }
  }, []);

  const searchLocations = async (query: string) => {
    if (!query.trim() || !autocompleteService.current || !placesService.current) return [];
    
    try {
      // Get predictions using AutocompleteService
      const { predictions } = await new Promise<{ predictions: google.maps.places.AutocompletePrediction[] }>((resolve, reject) => {
        autocompleteService.current!.getPlacePredictions(
          {
            input: query,
            types: ['geocode', '(cities)'],
            sessionToken: sessionToken.current!
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
            placesService.current!.getDetails(
              {
                placeId: prediction.place_id,
                fields: ['name', 'geometry', 'formatted_address'],
                sessionToken: sessionToken.current!
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
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
      
      return places;
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const results = await searchLocations(searchInput);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "There was a problem with the location search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectLocation = (location: { name: string; coords: { lat: number; lng: number } }) => {
    setSearchInput(location.name);
    setSearchResults([]);
    onLocationSelected(location);
    
    toast({
      title: "Location set",
      description: `You've selected ${location.name}`,
    });
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        const locationData = {
          name: "Current Location",
          coords: { lat: location.latitude, lng: location.longitude }
        };
        setSearchInput(locationData.name);
        onLocationSelected(locationData);
        
        toast({
          title: "Using current location",
          description: "Building recommendations based on where you are",
        });
      }
    } catch (error) {
      toast({
        title: "Location access denied",
        description: "Please enable location access or search for a location",
        variant: "destructive",
      });
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchResults([]);
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="flex rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          <div className="flex items-center justify-center bg-primary text-primary-foreground p-3">
            <MapPin className="h-5 w-5" />
          </div>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Where are you going?"
            className="flex-1 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="flex items-center justify-center p-3 hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchInput.trim()}
            className={cn(
              "flex items-center justify-center p-3 transition-colors",
              isSearching || !searchInput.trim() 
                ? "bg-muted text-muted-foreground" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-card rounded-lg border shadow-md z-10 animate-scale-in">
            <div className="max-h-60 overflow-y-auto space-y-1">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full flex items-center p-3 hover:bg-muted rounded-md transition-colors text-left"
                >
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                  <span className="text-sm truncate">{result.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="mt-2 w-full"
        onClick={handleUseCurrentLocation}
        disabled={isLocating}
      >
        <Navigation className="h-4 w-4 mr-2" />
        {isLocating ? "Getting your location..." : "Use my current location"}
      </Button>
    </div>
  );
};

export default LocationSelector;
