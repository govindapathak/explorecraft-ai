
import IconFilters from '@/components/IconFilters';

interface QuickFiltersSectionProps {
  onFilterChange: (filter: string | null) => void;
}

const QuickFiltersSection = ({ onFilterChange }: QuickFiltersSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quick Filters</h2>
      <IconFilters onFilterChange={onFilterChange} />
    </div>
  );
};

export default QuickFiltersSection;
