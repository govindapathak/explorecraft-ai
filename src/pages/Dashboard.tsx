
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '@/hooks/useLocation';
import { Recommendation } from '@/components/RecommendationTile';
import FilterCard, { SelectedFilters } from '@/components/FilterCard';
import IconFilters, { FilterCategory } from '@/components/IconFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MapPin, Map, LayoutGrid } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedItems, setSelectedItems] = useState<Recommendation[]>([]);
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  const { currentLocation, isLocating, getCurrentLocation } = useLocation();
  const isMobile = useIsMobile();

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

  const handleLocationDetect = async () => {
    try {
      await getCurrentLocation();
      toast({
        title: "Location detected",
        description: "We've found your location and are generating recommendations.",
      });
      
      // Simulate loading recommendations after location is detected
      setTimeout(() => {
        const mockRecommendations = [
          {
            id: '1',
            name: 'Central Park',
            type: 'attraction',
            image: 'https://images.unsplash.com/photo-1588712427408-bdad1d33cb21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VudHJhbCUyMHBhcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
            location: 'New York, NY',
            rating: 4.8,
            description: 'An urban park in Manhattan that spans 843 acres. It features walking paths, lakes, and various attractions.',
            duration: '3 hours',
            price: 'Free',
            tags: ['Park', 'Nature', 'Walking', 'Family-friendly']
          },
          {
            id: '2',
            name: 'The Metropolitan Museum of Art',
            type: 'attraction',
            image: 'https://images.unsplash.com/photo-1583153277365-d9d3abcf085c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWV0JTIwbXVzZXVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            location: 'New York, NY',
            rating: 4.9,
            description: 'One of the world\'s largest and finest art museums. Its collection includes more than two million works of art.',
            duration: '2 hours',
            price: '$25',
            tags: ['Art', 'Museum', 'Culture', 'Indoor']
          },
          {
            id: '3',
            name: 'Eataly',
            type: 'food',
            image: 'https://images.unsplash.com/photo-1551611398-5829b0ad3e20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aXRhbGlhbiUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
            location: 'New York, NY',
            rating: 4.5,
            description: 'Italian marketplace with restaurants, food and beverage counters, bakery, retail items, and a cooking school.',
            duration: '1.5 hours',
            price: '$$',
            tags: ['Italian', 'Food', 'Market', 'Restaurant']
          }
        ] as Recommendation[];
        
        setRecommendations(mockRecommendations);
      }, 1500);
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  const handleAddToItinerary = (item: Recommendation) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      toast({
        title: "Added to itinerary",
        description: `${item.name} has been added to your itinerary.`
      });
    }
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
          
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <h3 className="font-medium mb-3">Your location</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLocationDetect}
                disabled={isLocating}
              >
                <MapPin className="h-4 w-4" />
                {isLocating ? 'Detecting...' : 'Detect my location'}
              </Button>
              
              {currentLocation && (
                <div className="text-sm text-muted-foreground">
                  <div>Lat: {currentLocation.latitude.toFixed(4)}</div>
                  <div>Long: {currentLocation.longitude.toFixed(4)}</div>
                </div>
              )}
            </div>
          </div>
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
              <Button onClick={handleLocationDetect} disabled={isLocating}>
                {isLocating ? 'Detecting location...' : 'Detect location to start'}
              </Button>
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

export default Dashboard;
