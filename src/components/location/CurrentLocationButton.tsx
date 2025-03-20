
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrentLocationButtonProps {
  onClick: () => void;
  isLocating: boolean;
}

const CurrentLocationButton = ({ onClick, isLocating }: CurrentLocationButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2 w-full"
      onClick={onClick}
      disabled={isLocating}
    >
      <Navigation className="h-4 w-4 mr-2" />
      {isLocating ? "Getting your location..." : "Use my current location"}
    </Button>
  );
};

export default CurrentLocationButton;
