
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import IconFilters, { FilterCategory } from '@/components/IconFilters';
import RecommendationTile, { Recommendation } from '@/components/RecommendationTile';
import RecommendationsList from '@/components/recommendations/RecommendationsList';
import SelectedItemsSummary from '@/components/discover/SelectedItemsSummary';

interface DiscoverContentProps {
  isLoadingPlaces: boolean;
  isGeneratingRecommendations: boolean;
  apiError: string | null;
  retryLoadingApi: () => void;
  displayedAttractions: Recommendation[];
  hasRecommendations: boolean;
  recommendations: Recommendation[];
  isUsingFallback: boolean;
  places: Recommendation[];
  handleAddToItinerary: (item: Recommendation) => void;
  selectedItems: Recommendation[];
  handleCreateItinerary: () => void;
  handleIconFilterChange: (filter: FilterCategory | null) => void;
  isMobile: boolean;
  locationInsights?: string | null;
  userLocationName?: string;
}

const DiscoverContent = ({
  isLoadingPlaces,
  isGeneratingRecommendations,
  apiError,
  retryLoadingApi,
  displayedAttractions,
  hasRecommendations,
  recommendations,
  isUsingFallback,
  places,
  handleAddToItinerary,
  selectedItems,
  handleCreateItinerary,
  handleIconFilterChange,
  isMobile,
  locationInsights,
  userLocationName
}: DiscoverContentProps) => {
  const hasItems = Array.isArray(displayedAttractions) && displayedAttractions.length > 0;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {isLoadingPlaces || isGeneratingRecommendations 
            ? "Searching..." 
            : (hasItems 
              ? `${displayedAttractions.length} attractions found` 
              : "No attractions found")}
        </h2>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="default"
            onClick={handleCreateItinerary}
            disabled={!selectedItems || selectedItems.length === 0}
          >
            Create Itinerary ({selectedItems?.length || 0})
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
          <p className="text-muted-foreground">Searching for attractions near {userLocationName || 'your location'}</p>
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
      
      {!isLoadingPlaces && !isGeneratingRecommendations && (!displayedAttractions || displayedAttractions.length === 0) && (
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
      {!hasRecommendations && !isLoadingPlaces && !isGeneratingRecommendations && places && places.length > 0 && (
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
      
      {/* Selected items summary */}
      {selectedItems && selectedItems.length > 0 && (
        <SelectedItemsSummary 
          selectedItems={selectedItems} 
          onCreateItinerary={handleCreateItinerary} 
        />
      )}
    </div>
  );
};

export default DiscoverContent;
