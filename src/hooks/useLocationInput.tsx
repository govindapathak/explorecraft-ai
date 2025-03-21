
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { placesSearchService, type Location } from '@/services/placesSearchService';

interface UseLocationInputProps {
  initialLocation?: { name: string; latitude: number; longitude: number };
  onLocationSubmit: (location: { name: string; latitude: number; longitude: number }) => void;
}

export function useLocationInput({ initialLocation, onLocationSubmit }: UseLocationInputProps) {
  const [locationName, setLocationName] = useState(initialLocation?.name || '');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(initialLocation?.latitude.toString() || '');
  const [longitude, setLongitude] = useState(initialLocation?.longitude.toString() || '');
  
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setLocationName(initialLocation.name);
      setLatitude(initialLocation.latitude.toString());
      setLongitude(initialLocation.longitude.toString());
    }
  }, [initialLocation]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput.trim().length > 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleSearch = async () => {
    if (!searchInput.trim() || isSearching) return;
    
    setIsSearching(true);
    try {
      const results = await placesSearchService.searchLocations(searchInput);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching for locations:', error);
      toast({
        title: "Search failed",
        description: "Failed to search for locations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setLocationName(location.name);
    setLatitude(location.coords.lat.toString());
    setLongitude(location.coords.lng.toString());
    setSearchInput(location.name);
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationName.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for this location",
        variant: "destructive"
      });
      return;
    }
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude and longitude values",
        variant: "destructive"
      });
      return;
    }
    
    if (lat < -90 || lat > 90) {
      toast({
        title: "Invalid latitude",
        description: "Latitude must be between -90 and 90 degrees",
        variant: "destructive"
      });
      return;
    }
    
    if (lng < -180 || lng > 180) {
      toast({
        title: "Invalid longitude",
        description: "Longitude must be between -180 and 180 degrees",
        variant: "destructive"
      });
      return;
    }
    
    onLocationSubmit({
      name: locationName,
      latitude: lat,
      longitude: lng
    });
  };

  return {
    locationName,
    setLocationName,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    searchInput,
    setSearchInput,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    handleSearch,
    handleSelectLocation,
    handleClearSearch,
    handleKeyDown,
    handleSubmit
  };
}
