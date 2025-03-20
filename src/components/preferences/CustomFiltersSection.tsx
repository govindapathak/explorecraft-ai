
import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomFiltersSectionProps {
  customFilters: string[];
  onAddFilter: (filter: string) => void;
  onRemoveFilter: (filter: string) => void;
}

const CustomFiltersSection = ({ 
  customFilters, 
  onAddFilter, 
  onRemoveFilter 
}: CustomFiltersSectionProps) => {
  const [customFilter, setCustomFilter] = useState('');

  const handleAddCustomFilter = () => {
    if (customFilter.trim() && !customFilters.includes(customFilter.trim())) {
      onAddFilter(customFilter.trim());
      setCustomFilter('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomFilter();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Custom Filters</h2>
      <p className="text-sm text-muted-foreground">
        Add specific requirements for your attractions
      </p>
      
      <div className="flex space-x-2">
        <Input
          placeholder="e.g. pet friendly, wheelchair accessible"
          value={customFilter}
          onChange={(e) => setCustomFilter(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleAddCustomFilter}>Add</Button>
      </div>
      
      {customFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {customFilters.map((filter) => (
            <div 
              key={filter} 
              className="bg-secondary text-secondary-foreground py-1 px-3 rounded-full text-sm flex items-center"
            >
              {filter}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 hover:bg-destructive/10" 
                onClick={() => onRemoveFilter(filter)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFiltersSection;
