import { useState } from 'react';
import { Check, Accessibility, Cloud, Star, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Filter {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export interface SelectedFilters {
  [key: string]: boolean;
}

interface FilterCardProps {
  onFiltersChanged: (filters: SelectedFilters) => void;
}

const FilterCard = ({ onFiltersChanged }: FilterCardProps) => {
  const availableFilters: Filter[] = [
    { 
      id: 'accessibility', 
      name: 'Accessibility', 
      icon: <Accessibility className="h-5 w-5" />,
      description: 'Pram/wheelchair accessible places'
    },
    { 
      id: 'ratings', 
      name: 'Higher Ratings', 
      icon: <Star className="h-5 w-5" />,
      description: 'Places with 4+ star ratings'
    },
    { 
      id: 'weather', 
      name: 'Weather Proof', 
      icon: <Cloud className="h-5 w-5" />,
      description: 'Suitable for rainy weather'
    },
    { 
      id: 'parking', 
      name: 'Parking', 
      icon: <Car className="h-5 w-5" />,
      description: 'Easy parking availability'
    }
  ];
  
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [customFilter, setCustomFilter] = useState<string>('');
  
  const handleFilterToggle = (filterId: string) => {
    const newSelectedFilters = {
      ...selectedFilters,
      [filterId]: !selectedFilters[filterId]
    };
    
    if (!newSelectedFilters[filterId]) {
      delete newSelectedFilters[filterId];
    }
    
    setSelectedFilters(newSelectedFilters);
    onFiltersChanged(newSelectedFilters);
  };
  
  const addCustomFilter = () => {
    if (customFilter.trim()) {
      const newFilter = {
        ...selectedFilters,
        [`custom-${Date.now()}`]: true
      };
      setSelectedFilters(newFilter);
      onFiltersChanged(newFilter);
      setCustomFilter('');
    }
  };
  
  const selectedCount = Object.keys(selectedFilters).length;
  
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 shadow-card hover:shadow-lg bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20 self-start">
          Preferences
        </Badge>
        <CardTitle className="text-xl">Customize Your Experience</CardTitle>
        <CardDescription>Select what matters most to you</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <div className="space-y-3">
          {availableFilters.map((filter) => (
            <div
              key={filter.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                selectedFilters[filter.id] 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-secondary border border-transparent"
              )}
              onClick={() => handleFilterToggle(filter.id)}
            >
              <Checkbox 
                id={filter.id}
                checked={!!selectedFilters[filter.id]}
                className={cn(
                  "transition-all",
                  selectedFilters[filter.id] && "text-primary"
                )}
                onCheckedChange={() => handleFilterToggle(filter.id)}
              />
              <div className="flex flex-1 items-center">
                <div className={cn(
                  "p-2 rounded-full mr-3",
                  selectedFilters[filter.id] ? "bg-primary/20" : "bg-muted"
                )}>
                  {filter.icon}
                </div>
                <div className="flex flex-col">
                  <label htmlFor={filter.id} className="text-sm font-medium cursor-pointer">
                    {filter.name}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {filter.description}
                  </span>
                </div>
              </div>
              {selectedFilters[filter.id] && (
                <Check className="h-4 w-4 text-primary mr-1" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-4">
        <Button 
          variant="default" 
          className="w-full"
          disabled={selectedCount === 0}
        >
          Apply {selectedCount > 0 && `(${selectedCount})`} Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FilterCard;
