
import { Label } from '@/components/ui/label';
import { useLocationInput } from '@/hooks/useLocationInput';
import SearchBar from '@/components/location/SearchBar';
import SearchResults from '@/components/location/SearchResults';
import CoordinatesInput from '@/components/location/CoordinatesInput';
import LocationSubmitButton from '@/components/location/LocationSubmitButton';

interface ManualLocationInputProps {
  onLocationSubmit: (location: { name: string; latitude: number; longitude: number }) => void;
  isLoading?: boolean;
  initialLocation?: { name: string; latitude: number; longitude: number };
}

const ManualLocationInput = ({ 
  onLocationSubmit, 
  isLoading = false,
  initialLocation
}: ManualLocationInputProps) => {
  const {
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
  } = useLocationInput({
    initialLocation,
    onLocationSubmit
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Search for a location</Label>
          <div className="relative">
            <SearchBar 
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSearch={handleSearch}
              isSearching={isSearching}
              onClear={handleClearSearch}
              onKeyDown={handleKeyDown}
              showResults={showResults}
              setShowResults={setShowResults}
            />
            <SearchResults 
              results={searchResults} 
              onSelectLocation={handleSelectLocation}
              visible={showResults}
            />
          </div>
        </div>
        
        <CoordinatesInput
          locationName={locationName}
          setLocationName={setLocationName}
          address={address}
          setAddress={setAddress}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          isLoading={isLoading}
        />
        
        <LocationSubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default ManualLocationInput;
