
import { MapPin } from 'lucide-react';

interface Location {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
}

interface SearchResultsProps {
  results: Location[];
  onSelectLocation: (location: Location) => void;
  visible: boolean;
}

const SearchResults = ({ results, onSelectLocation, visible }: SearchResultsProps) => {
  if (!visible || results.length === 0) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-background rounded-lg border shadow-md z-50 animate-in fade-in-50 zoom-in-95">
      <div className="max-h-60 overflow-y-auto space-y-1">
        {results.map((result, index) => (
          <button
            key={index}
            onClick={() => onSelectLocation(result)}
            className="w-full flex items-center p-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
            <span className="text-sm truncate">{result.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
