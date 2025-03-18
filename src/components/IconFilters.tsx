
import { useState } from 'react';
import { Accessibility, Star, Cloud, Car, Coffee, Mountain, Compass, Museum } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FilterCategory = 
  | 'accessibility'
  | 'ratings'
  | 'weatherProof'
  | 'parking'
  | 'food'
  | 'outdoor'
  | 'adventure'
  | 'culture';

interface IconFilter {
  id: FilterCategory;
  icon: React.ReactNode;
  label: string;
}

interface IconFiltersProps {
  onFilterChange?: (selectedFilter: FilterCategory | null) => void;
  className?: string;
  vertical?: boolean;
}

const IconFilters = ({ onFilterChange, className, vertical = false }: IconFiltersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory | null>(null);

  const filters: IconFilter[] = [
    { id: 'accessibility', icon: <Accessibility className="h-4 w-4" />, label: 'Accessible' },
    { id: 'ratings', icon: <Star className="h-4 w-4" />, label: 'Top Rated' },
    { id: 'weatherProof', icon: <Cloud className="h-4 w-4" />, label: 'Weather Proof' },
    { id: 'parking', icon: <Car className="h-4 w-4" />, label: 'Parking' },
    { id: 'food', icon: <Coffee className="h-4 w-4" />, label: 'Food & Drinks' },
    { id: 'outdoor', icon: <Mountain className="h-4 w-4" />, label: 'Outdoor' },
    { id: 'adventure', icon: <Compass className="h-4 w-4" />, label: 'Adventure' },
    { id: 'culture', icon: <Museum className="h-4 w-4" />, label: 'Culture' }
  ];

  const handleFilterClick = (filterId: FilterCategory) => {
    // If already selected, deselect it
    const newValue = selectedFilter === filterId ? null : filterId;
    setSelectedFilter(newValue);
    if (onFilterChange) {
      onFilterChange(newValue);
    }
  };

  return (
    <div className={cn(
      'flex gap-2',
      vertical ? 'flex-col' : 'flex-row flex-wrap',
      className
    )}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={cn(
            'group relative flex items-center justify-center rounded-full w-10 h-10 transition-all',
            selectedFilter === filter.id 
              ? 'bg-primary text-white shadow-sm' 
              : 'bg-background hover:bg-primary/10 border border-border'
          )}
          title={filter.label}
          aria-label={filter.label}
        >
          {filter.icon}
          <span className="sr-only">{filter.label}</span>
          
          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10 pointer-events-none">
            {filter.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default IconFilters;
