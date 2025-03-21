
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import IconFilters, { FilterCategory } from '@/components/IconFilters';
import FilterCard, { SelectedFilters } from '@/components/FilterCard';
import LocationSelector from '@/components/LocationSelector';
import { type Location } from '@/services/placesSearchService';

interface DiscoverSidebarProps {
  onFilterChange: (filter: FilterCategory | null) => void;
  onFiltersChanged: (filters: SelectedFilters) => void;
  onLocationSelected: (location: Location) => void;
  initialLocation: Location | null;
  onGenerateRecommendations: () => void;
  isGeneratingRecommendations: boolean;
  isMobile: boolean;
}

const DiscoverSidebar = ({
  onFilterChange,
  onFiltersChanged,
  onLocationSelected,
  initialLocation,
  onGenerateRecommendations,
  isGeneratingRecommendations,
  isMobile
}: DiscoverSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Icon Filters - Show vertically on desktop, horizontally on mobile */}
      <div className="bg-card rounded-lg p-4 shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Quick Filters</h3>
          {!isGeneratingRecommendations && (
            <Button 
              size="sm" 
              onClick={onGenerateRecommendations}
              className="flex items-center"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Get AI Picks
            </Button>
          )}
        </div>
        <IconFilters 
          vertical={!isMobile} 
          onFilterChange={onFilterChange}
          className={isMobile ? "justify-center" : ""}
        />
      </div>
      
      <FilterCard onFiltersChanged={onFiltersChanged} />
      
      {/* Location Search */}
      <div className="bg-card rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium mb-3">Change Location</h3>
        <LocationSelector 
          onLocationSelected={onLocationSelected}
          initialLocation={initialLocation}
        />
      </div>
    </div>
  );
};

export default DiscoverSidebar;
