
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Map as MapIcon, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import AttractionSearch from '@/components/AttractionSearch';
import RecommendationTile from '@/components/RecommendationTile';
import IconFilters, { FilterCategory } from '@/components/IconFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterCard, { SelectedFilters } from '@/components/FilterCard';

interface UserPreferences {
  location: {
    name: string;
    coords: { lat: number; lng: number };
  };
  likes: string[];
  dislikes: string[];
  customFilters: string[];
}

const DiscoverPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  
  const { 
    places, 
    isLoading, 
    locationInsights,
    searchNearbyPlaces,
    apiError,
    retryLoadingApi
  } = useNearbyPlaces(30000); // 30km ~ 18.6 miles
  
  // Load user preferences on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setUserPreferences(preferences);
      
      // Automatically search for attractions based on saved location
      if (preferences.location) {
        searchNearbyPlaces({
          name: preferences.location.name,
          latitude: preferences.location.coords.lat,
          longitude: preferences.location.coords.lng
        });
      }
    }
  }, [searchNearbyPlaces]);
  
  const handleFiltersChanged = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
    // In a real app, this would filter the existing places or trigger a new search
  };

  const handleIconFilterChange = (filter: FilterCategory | null) => {
    setIconFilter(filter);
    // In a real app, this would filter the existing places or trigger a new search
  };
  
  const handleAddToItinerary = (item: any) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      toast({
        title: "Added to itinerary",
        description: `${item.name} has been added to your itinerary.`
      });
    }
  };
  
  const handleCreateItinerary = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one attraction for your itinerary.",
        variant: "destructive"
      });
      return;
    }
    
    // Store selected items for the itinerary page
    localStorage.setItem('itineraryItems', JSON.stringify(selectedItems));
    navigate('/itinerary');
  };
  
  // Filter recommendations based on user preferences
  const filteredRecommendations = places.filter(place => {
    if (!userPreferences) return true;
    
    // Filter out disliked categories
    if (userPreferences.dislikes.some(dislike => 
      place.tags.some(tag => tag.toLowerCase().includes(dislike.toLowerCase()))
    )) {
      return false;
    }
    
    // If icon filter is active, check tags
    if (iconFilter) {
      const filterKeywords = getFilterKeywords(iconFilter);
      return place.tags.some(tag => 
        filterKeywords.some(keyword => 
          tag.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
    
    return true;
  });
  
  // Helper function to get keywords for filtering
  const getFilterKeywords = (filter: FilterCategory): string[] => {
    switch (filter) {
      case 'accessibility': return ['accessible', 'wheelchair'];
      case 'ratings': return ['top rated', 'popular'];
      case 'weatherProof': return ['indoor', 'museum'];
      case 'parking': return ['parking'];
      case 'food': return ['restaurant', 'cafe', 'food'];
      case 'outdoor': return ['park', 'garden', 'outdoor'];
      case 'adventure': return ['adventure', 'tour'];
      case 'culture': return ['museum', 'gallery', 'historical'];
      default: return [];
    }
  };
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Discover attractions</h1>
        <p className="text-muted-foreground">
          {locationInsights || 
           (userPreferences?.location ? 
            `Exploring attractions near ${userPreferences.location.name}` : 
            "Find attractions based on your preferences")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        {/* Sidebar with Filters */}
        <div className="space-y-6">
          {/* Icon Filters - Show vertically on desktop, horizontally on mobile */}
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <h3 className="font-medium mb-3">Quick Filters</h3>
            <IconFilters 
              vertical={!isMobile} 
              onFilterChange={handleIconFilterChange}
              className={isMobile ? "justify-center" : ""}
            />
          </div>
          
          <FilterCard onFiltersChanged={handleFiltersChanged} />
          
          {/* Location Search */}
          <AttractionSearch />
        </div>
        
        {/* Main Content */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isLoading ? "Searching..." : 
               filteredRecommendations.length > 0 ? 
               `${filteredRecommendations.length} attractions found` : 
               "No attractions found"}
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <MapIcon className="h-4 w-4 mr-2" />
                Map View
              </Button>
              <Button 
                size="sm" 
                variant="default"
                onClick={handleCreateItinerary}
                disabled={selectedItems.length === 0}
              >
                Create Itinerary ({selectedItems.length})
              </Button>
            </div>
          </div>
          
          {/* Mobile only - horizontal filter strip */}
          {isMobile && (
            <div className="mb-4 -mx-2 px-2 py-3 overflow-x-auto">
              <IconFilters vertical={false} onFilterChange={handleIconFilterChange} />
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Searching for attractions near {userPreferences?.location?.name || 'your location'}</p>
            </div>
          )}
          
          {apiError && !isLoading && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">{apiError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryLoadingApi}
                className="mx-auto"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}
          
          {!isLoading && !apiError && filteredRecommendations.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No attractions found matching your criteria</p>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or searching in a different location</p>
            </div>
          )}
          
          {!isLoading && filteredRecommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRecommendations.map(item => (
                <RecommendationTile
                  key={item.id}
                  recommendation={item}
                  onAdd={handleAddToItinerary}
                  isAdded={selectedItems.some(selected => selected.id === item.id)}
                />
              ))}
            </div>
          )}
          
          {selectedItems.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Your selections ({selectedItems.length})</h3>
                <Button onClick={handleCreateItinerary}>Create Itinerary</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedItems.slice(0, 3).map(item => (
                  <div key={item.id} className="border rounded-md p-2 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium truncate">{item.name}</div>
                  </div>
                ))}
                {selectedItems.length > 3 && (
                  <div className="border rounded-md p-2 flex items-center justify-center text-sm text-muted-foreground">
                    +{selectedItems.length - 3} more items
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
