
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';

interface LocationSubmitButtonProps {
  isLoading?: boolean;
}

const LocationSubmitButton = ({ isLoading = false }: LocationSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 mr-2" />
          Use This Location
        </>
      )}
    </Button>
  );
};

export default LocationSubmitButton;
