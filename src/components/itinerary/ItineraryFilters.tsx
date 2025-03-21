
import IconFilters, { FilterCategory } from '@/components/IconFilters';

interface ItineraryFiltersProps {
  onFilterChange: (filter: FilterCategory | null) => void;
  vertical: boolean;
}

const ItineraryFilters = ({ onFilterChange, vertical }: ItineraryFiltersProps) => {
  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="font-medium mb-3">Filter by Experience Type</h3>
      <IconFilters 
        vertical={vertical} 
        onFilterChange={onFilterChange}
        className={!vertical ? "justify-center" : ""}
      />
    </div>
  );
};

export default ItineraryFilters;
