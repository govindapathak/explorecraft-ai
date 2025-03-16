
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Clock, MoreHorizontal, Trash2, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from './RecommendationTile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ItineraryListProps {
  items: Recommendation[];
  onItemsReordered: (items: Recommendation[]) => void;
  onItemRemoved: (id: string) => void;
  onSaveItinerary: () => void;
}

const ItineraryList = ({ items, onItemsReordered, onItemRemoved, onSaveItinerary }: ItineraryListProps) => {
  const [isClient, setIsClient] = useState(false);
  const [locations, setLocations] = useState<Record<string, { distance: string }>>({});

  useEffect(() => {
    setIsClient(true);
    
    // Simulate getting distances between locations
    const simulatedLocations: Record<string, { distance: string }> = {};
    
    items.forEach((item, index) => {
      if (index > 0) {
        // Random distance between 0.5 and 5 miles
        const distance = (Math.random() * 4.5 + 0.5).toFixed(1);
        simulatedLocations[item.id] = { distance: `${distance} miles` };
      }
    });
    
    setLocations(simulatedLocations);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    onItemsReordered(reorderedItems);
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    
    items.forEach(item => {
      const durationMatch = item.duration.match(/(\d+)/);
      if (durationMatch) {
        totalMinutes += parseInt(durationMatch[1], 10);
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`;
  };

  const handleSave = () => {
    onSaveItinerary();
    toast({
      title: "Itinerary saved",
      description: `Your itinerary with ${items.length} items has been saved.`,
    });
  };

  if (!isClient) {
    return <div className="p-8 text-center text-muted-foreground">Loading itinerary...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <h3 className="font-medium mb-2">Your itinerary is empty</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add recommendations to build your perfect day
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Your Itinerary</h3>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} • {getTotalDuration()} total
            </p>
          </div>
          <Button size="sm" onClick={handleSave}>
            <Calendar className="h-4 w-4 mr-2" />
            Save Itinerary
          </Button>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="itinerary">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "bg-background rounded-lg border transition-all overflow-hidden",
                          snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                        )}
                      >
                        <div className="flex">
                          <div 
                            className="w-20 h-24 flex-shrink-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium line-clamp-1">{item.name}</div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="line-clamp-1">{item.location}</span>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => onItemRemoved(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center text-xs">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{item.duration}</span>
                              </div>
                              
                              {index > 0 && locations[item.id] && (
                                <div className="text-xs text-muted-foreground">
                                  {locations[item.id].distance} from previous
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ItineraryList;
