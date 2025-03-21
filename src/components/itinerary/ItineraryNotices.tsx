
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ItineraryNoticesProps {
  locationInsights: string | null;
  currentLocation: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  placesCount: number;
}

const ItineraryNotices = ({ locationInsights, currentLocation, isLoading, placesCount }: ItineraryNoticesProps) => {
  if (!locationInsights && (!currentLocation || isLoading || placesCount > 0)) {
    return null;
  }

  return (
    <>
      {locationInsights && (
        <Alert className="bg-primary/10 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary-foreground">
            {locationInsights}
          </AlertDescription>
        </Alert>
      )}

      {currentLocation && !isLoading && placesCount === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Location detected, but no attractions found nearby. Try a different location or increase the search radius.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ItineraryNotices;
