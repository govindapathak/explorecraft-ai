
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Map as MapIcon, Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { useLocation } from '@/hooks/useLocation';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import AttractionSearch from '@/components/AttractionSearch';
import RecommendationTile from '@/components/RecommendationTile';
import RecommendationsList from '@/components/recommendations/RecommendationsList';
import IconFilters, { FilterCategory } from '@/components/IconFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterCard, { SelectedFilters } from '@/components/FilterCard';
import LocationSelector from '@/components/LocationSelector';

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
  const { currentLocation, getCurrentLocation } = useLocation();
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  
  const { 
    places, 
    isLoading: isLoadingPlaces, 
    locationInsights,
    searchNearbyPlaces,
    apiError,
    retryLoadingApi
  } = useNearbyPlaces(30000); // 30km ~ 18.6 miles

  const {
    recommendations,
    isLoading: isGeneratingRecommendations,
    isUsingFallback,
    generateRecommendations,
    hasRecommendations
  } = useAIRecommendations();
  
  // Try to load user location automatically
  useEffect(() => {
    const tryGetLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          const locationData = {
            name: "Current Location",
            coords: { 
              lat: location.latitude, 
              lng: location.longitude 
            }
          };
          handleLocationSelected(locationData);
          setShowLocationPrompt(false);
        }
      } catch (error) {
        console.log('Could not automatically get location, showing prompt');
      }
    };
    
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        handleLocationSelected(parsedLocation);
        setShowLocationPrompt(false);
      } catch (e) {
        tryGetLocation();
      }
    } else {
      tryGetLocation();
    }
  }, []);
  
  // Set up preferences based on selected location and filters
  useEffect(() => {
    if (userPreferences?.location) {
      const activeFilters = Object.keys(selectedFilters).filter(key => selectedFilters[key]);
      
      // Add icon filter if selected
      let likes = [...(activeFilters || [])];
      if (iconFilter) {
        likes.push(iconFilter);
      }
      
      // Make sure we have unique values
      likes = [...new Set(likes)];
      
      if (likes.length > 0) {
        const updatedPreferences = {
          ...userPreferences,
          likes,
          dislikes: []
        };
        setUserPreferences(updatedPreferences);
        
        // Generate AI recommendations when filters change
        generateRecommendations(updatedPreferences);
      }
    }
  }, [selectedFilters, iconFilter]);
  
  const handleFiltersChanged = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
  };

  const handleIconFilterChange = (filter: FilterCategory | null) => {
    setIconFilter(filter);
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
  
  const handleLocationSelected = (location: any) => {
    localStorage.setItem('userLocation', JSON.stringify(location));
    setShowLocationPrompt(false);
    
    // Search for nearby places when location is selected
    searchNearbyPlaces({
      name: location.name,
      latitude: location.coords.lat,
      longitude: location.coords.lng
    });
    
    // Update preferences with new location
    setUserPreferences({
      location,
      likes: [],
      dislikes: [],
      customFilters: []
    });
  };
  
  const handleGenerateRecommendations = () => {
    if (!userPreferences) return;
    
    const activeFilters = Object.keys(selectedFilters).filter(key => selectedFilters[key]);
    
    // Add icon filter if selected
    let likes = [...(activeFilters || [])];
    if (iconFilter) {
      likes.push(iconFilter);
    }
    
    // Make sure we have unique values
    likes = [...new Set(likes)];
    
    if (likes.length === 0) {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to generate personalized recommendations.",
        variant: "default"
      });
      return;
    }
    
    const updatedPreferences = {
      ...userPreferences,
      likes,
      dislikes: []
    };
    
    generateRecommendations(updatedPreferences);
  };
  
  // Filter displayed recommendations based on active filters
  const displayedAttractions = hasRecommendations ? recommendations : places;
  
  if (showLocationPrompt) {
    return (
      <div className="container mx-auto max-w-xl py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Discover nearby attractions</h1>
          <p className="text-muted-foreground">We need your location to find attractions near you</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <LocationSelector 
              onLocationSelected={handleLocationSelected}
              initialLocation={null}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Quick Filters</h3>
              {!isGeneratingRecommendations && (
                <Button 
                  size="sm" 
                  onClick={handleGenerateRecommendations}
                  className="flex items-center"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Get AI Picks
                </Button>
              )}
            </div>
            <IconFilters 
              vertical={!isMobile} 
              onFilterChange={handleIconFilterChange}
              className={isMobile ? "justify-center" : ""}
            />
          </div>
          
          <FilterCard onFiltersChanged={handleFiltersChanged} />
          
          {/* Location Search */}
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <h3 className="font-medium mb-3">Change Location</h3>
            <LocationSelector 
              onLocationSelected={handleLocationSelected}
              initialLocation={userPreferences?.location || null}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isLoadingPlaces || isGeneratingRecommendations ? "Searching..." : 
               displayedAttractions.length > 0 ? 
               `${displayedAttractions.length} attractions found` : 
               "No attractions found"}
            </h2>
            <div className="flex gap-2">
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
          
          {isGeneratingRecommendations && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">AI is generating personalized recommendations</p>
            </div>
          )}
          
          {isLoadingPlaces && !isGeneratingRecommendations && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Searching for attractions near {userPreferences?.location?.name || 'your location'}</p>
            </div>
          )}
          
          {apiError && !isLoadingPlaces && !isGeneratingRecommendations && (
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
          
          {!isLoadingPlaces && !isGeneratingRecommendations && displayedAttractions.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No attractions found matching your criteria</p>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or searching in a different location</p>
            </div>
          )}
          
          {/* Display AI Recommendations if available */}
          {hasRecommendations && (
            <RecommendationsList
              recommendations={recommendations}
              onAddToItinerary={handleAddToItinerary}
              selectedItems={selectedItems}
              isUsingFallback={isUsingFallback}
            />
          )}
          
          {/* Display regular places if no AI recommendations */}
          {!hasRecommendations && !isLoadingPlaces && !isGeneratingRecommendations && places.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {places.map(item => (
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
