import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recommendation } from '@/components/RecommendationTile';
import FilterCard, { SelectedFilters } from '@/components/FilterCard';
import IconFilters, { FilterCategory } from '@/components/IconFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Map, LayoutGrid } from 'lucide-react';
import AttractionSearch from '@/components/AttractionSearch';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';

const Dashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  const isMobile = useIsMobile();
  const { places: recommendations, selectedItems = [], handleAddToItinerary } = useNearbyAttractions();

  const handleFiltersChanged = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
    // In a real app, this would trigger a API call to get recommendations based on filters
    console.log('Filters updated:', filters);
  };

  const handleIconFilterChange = (filter: FilterCategory | null) => {
    setIconFilter(filter);
    // In a real app, this would trigger an API call to filter recommendations
    console.log('Icon filter changed:', filter);
  };

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Discover experiences</h1>
        <p className="text-muted-foreground">Find recommendations based on your preferences</p>
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
          
          {/* Replace with new AttractionSearch component */}
          <AttractionSearch />
        </div>
        
        {/* Main Content */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommendations</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Map className="h-4 w-4 mr-2" />
                Map View
              </Button>
              <Button size="sm" variant="outline">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid View
              </Button>
            </div>
          </div>
          
          {/* Mobile only - horizontal filter strip */}
          {isMobile && (
            <div className="mb-4 -mx-2 px-2 py-3 overflow-x-auto">
              <IconFilters vertical={false} onFilterChange={handleIconFilterChange} />
            </div>
          )}
          
          {recommendations.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No recommendations yet</p>
              <p className="text-muted-foreground mb-4">Use the search options on the left to find attractions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(item => (
                <div key={item.id} className="h-full">
                  {/* Placeholder for RecommendationTile component */}
                  <div className="h-full border rounded-lg p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.location}</p>
                    <p className="text-sm mb-4">{item.description}</p>
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddToItinerary(item)}
                      disabled={selectedItems.some(selected => selected.id === item.id)}
                    >
                      {selectedItems.some(selected => selected.id === item.id) 
                        ? 'Added to Itinerary' 
                        : 'Add to Itinerary'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedItems.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Your selections ({selectedItems.length})</h3>
                <Link to="/itinerary">
                  <Button>View full itinerary</Button>
                </Link>
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

// Custom hook to manage recommendations and selection
function useNearbyAttractions() {
  const { places } = useNearbyPlaces();
  const [selectedItems, setSelectedItems] = useState<Recommendation[]>([]);
  
  const handleAddToItinerary = (item: Recommendation) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  return { places, selectedItems, handleAddToItinerary };
}

export default Dashboard;
