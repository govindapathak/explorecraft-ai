
import { MapPin, Share2, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ManualLocationInput from '@/components/ManualLocationInput';

interface ItinerarySummaryProps {
  onFindNearbyAttractions: () => void;
  onManualLocation: (location: { name: string; latitude: number; longitude: number }) => void;
  onShareItinerary: () => void;
  onSaveItinerary: () => void;
  isLocating: boolean;
  isLoading: boolean;
}

const ItinerarySummary = ({
  onFindNearbyAttractions,
  onManualLocation,
  onShareItinerary,
  onSaveItinerary,
  isLocating,
  isLoading
}: ItinerarySummaryProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-lg border">
      <div>
        <h2 className="font-medium">Trip to New York</h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onFindNearbyAttractions}
          disabled={isLocating || isLoading}
        >
          {isLocating || isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 mr-2" />
          )}
          {isLocating ? 'Detecting...' : isLoading ? 'Finding places...' : 'Find nearby attractions'}
        </Button>
        
        <ManualLocationInput 
          onLocationSubmit={onManualLocation}
          isLoading={isLoading}
        />
        
        <Button size="sm" variant="outline" onClick={onShareItinerary}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button size="sm" onClick={onSaveItinerary}>
          <Calendar className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default ItinerarySummary;
