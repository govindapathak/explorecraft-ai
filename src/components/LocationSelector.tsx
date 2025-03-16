
import { useState, useEffect } from 'react';
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

  // Simulated search function (would be replaced with actual API call)
  const searchLocations = (query: string) => {
    if (!query.trim()) return [];
    
    // Simulated data
    return [
      { name: `${query} City Center`, coords: { lat: 40.7128, lng: -74.006 } },
      { name: `${query} Downtown`, coords: { lat: 40.7168, lng: -74.016 } },
      { name: `${query} Old Town`, coords: { lat: 40.7228, lng: -74.026 } },
    ];
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = searchLocations(searchInput);
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    }, 800);
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
