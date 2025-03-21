
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectedItemsSummaryProps {
  selectedItems: any[];
  onCreateItinerary: () => void;
}

const SelectedItemsSummary = ({ selectedItems, onCreateItinerary }: SelectedItemsSummaryProps) => {
  if (selectedItems.length === 0) return null;
  
  return (
    <div className="mt-6 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Your selections ({selectedItems.length})</h3>
        <Button onClick={onCreateItinerary}>Create Itinerary</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {selectedItems.slice(0, 3).map(item => (
          <div key={item.id} className="border rounded-md p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm font-medium truncate">{item.name}</div>
          </div>
        ))}
        {selectedItems.length > 3 && (
          <div className="border rounded-md p-2 flex items-center justify-center text-sm text-muted-foreground">
            +{selectedItems.length - 3} more items
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedItemsSummary;
