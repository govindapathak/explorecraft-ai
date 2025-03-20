
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { placesSearchService, type Location } from '@/services/placesSearchService';
import SearchBar from '@/components/location/SearchBar';
import SearchResults from '@/components/location/SearchResults';
import CurrentLocationButton from '@/components/location/CurrentLocationButton';

interface LocationSelectorProps {
  onLocationSelected: (location: Location) => void;
}

const LocationSelector = ({ onLocationSelected }: LocationSelectorProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const { currentLocation, isLocating, getCurrentLocation } = useLocation();

  // Initialize Google Maps places services
  useEffect(() => {
    placesSearchService.initServices();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const results = await placesSearchService.searchLocations(searchInput);
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

  const handleSelectLocation = (location: Location) => {
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
      <SearchBar 
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
        isSearching={isSearching}
        onClear={clearSearch}
        onKeyDown={handleKeyDown}
      />
      
      <SearchResults 
        results={searchResults}
        onSelectLocation={handleSelectLocation}
      />
      
      <CurrentLocationButton 
        onClick={handleUseCurrentLocation}
        isLocating={isLocating}
      />
    </div>
  );
};

export default LocationSelector;
