
import { useState } from 'react';
import { Accessibility, Star, Cloud, Car, Coffee, Mountain, Compass, Landmark } from 'lucide-react';
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
  keywords: string[]; // Keywords to match against place types or tags
}

interface IconFiltersProps {
  onFilterChange?: (selectedFilter: FilterCategory | null) => void;
  className?: string;
  vertical?: boolean;
}

const IconFilters = ({ onFilterChange, className, vertical = false }: IconFiltersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory | null>(null);

  const filters: IconFilter[] = [
    { 
      id: 'accessibility', 
      icon: <Accessibility className="h-4 w-4" />, 
      label: 'Accessible',
      keywords: ['wheelchair', 'accessible', 'disability']
    },
    { 
      id: 'ratings', 
      icon: <Star className="h-4 w-4" />, 
      label: 'Top Rated',
      keywords: ['top_rated', 'highly_rated', 'popular']
    },
    { 
      id: 'weatherProof', 
      icon: <Cloud className="h-4 w-4" />, 
      label: 'Weather Proof',
      keywords: ['indoor', 'museum', 'mall', 'theater']
    },
    { 
      id: 'parking', 
      icon: <Car className="h-4 w-4" />, 
      label: 'Parking',
      keywords: ['parking', 'car', 'parking_lot']
    },
    { 
      id: 'food', 
      icon: <Coffee className="h-4 w-4" />, 
      label: 'Food & Drinks',
      keywords: ['restaurant', 'cafe', 'bar', 'food', 'bakery', 'meal']
    },
    { 
      id: 'outdoor', 
      icon: <Mountain className="h-4 w-4" />, 
      label: 'Outdoor',
      keywords: ['park', 'garden', 'nature', 'outdoor', 'trail', 'beach', 'mountain']
    },
    { 
      id: 'adventure', 
      icon: <Compass className="h-4 w-4" />, 
      label: 'Adventure',
      keywords: ['adventure', 'hiking', 'tour', 'sightseeing', 'climbing']
    },
    { 
      id: 'culture', 
      icon: <Landmark className="h-4 w-4" />, 
      label: 'Culture',
      keywords: ['museum', 'gallery', 'theater', 'historical', 'landmark', 'monument', 'art']
    }
  ];

  const handleFilterClick = (filterId: FilterCategory) => {
    // If already selected, deselect it
    const newValue = selectedFilter === filterId ? null : filterId;
    setSelectedFilter(newValue);
    if (onFilterChange) {
      onFilterChange(newValue);
    }
    
    console.log('Filter changed to:', newValue);
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
