
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreferencesFooterProps {
  onNext: () => void;
}

const PreferencesFooter = ({ onNext }: PreferencesFooterProps) => {
  return (
    <Button 
      size="lg" 
      className="w-full mt-6" 
      onClick={onNext}
    >
      Find Attractions
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default PreferencesFooter;
