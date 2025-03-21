
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ItineraryHeader = () => {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Link to="/dashboard">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Your Itinerary</h1>
    </div>
  );
};

export default ItineraryHeader;
