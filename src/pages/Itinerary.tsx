
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ItineraryList from '@/components/ItineraryList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { Recommendation } from '@/components/RecommendationTile';

const Itinerary = () => {
  const [items, setItems] = useState<Recommendation[]>([
    {
      id: '1',
      name: 'Central Park',
      type: 'attraction',
      image: 'https://images.unsplash.com/photo-1588712427408-bdad1d33cb21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VudHJhbCUyMHBhcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      location: 'New York, NY',
      rating: 4.8,
      description: 'An urban park in Manhattan that spans 843 acres. It features walking paths, lakes, and various attractions.',
      duration: '3 hours',
      price: 'Free',
      tags: ['Park', 'Nature', 'Walking', 'Family-friendly']
    },
    {
      id: '2',
      name: 'The Metropolitan Museum of Art',
      type: 'attraction',
      image: 'https://images.unsplash.com/photo-1583153277365-d9d3abcf085c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWV0JTIwbXVzZXVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      location: 'New York, NY',
      rating: 4.9,
      description: 'One of the world\'s largest and finest art museums. Its collection includes more than two million works of art.',
      duration: '2 hours',
      price: '$25',
      tags: ['Art', 'Museum', 'Culture', 'Indoor']
    },
    {
      id: '3',
      name: 'Eataly',
      type: 'food',
      image: 'https://images.unsplash.com/photo-1551611398-5829b0ad3e20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aXRhbGlhbiUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      location: 'New York, NY',
      rating: 4.5,
      description: 'Italian marketplace with restaurants, food and beverage counters, bakery, retail items, and a cooking school.',
      duration: '1.5 hours',
      price: '$$',
      tags: ['Italian', 'Food', 'Market', 'Restaurant']
    }
  ]);

  const handleReorderItems = (reorderedItems: Recommendation[]) => {
    setItems(reorderedItems);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your itinerary."
    });
  };

  const handleSaveItinerary = () => {
    // In a real app, this would save to backend
    toast({
      title: "Itinerary saved",
      description: "Your itinerary has been saved successfully."
    });
  };

  const handleShareItinerary = () => {
    // In a real app, this would generate a shareable link
    toast({
      title: "Share link created",
      description: "A shareable link has been copied to your clipboard."
    });
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Your Itinerary</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-lg border">
          <div>
            <h2 className="font-medium">Trip to New York</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleShareItinerary}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" onClick={handleSaveItinerary}>
              <Calendar className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <ItineraryList 
          items={items}
          onItemsReordered={handleReorderItems}
          onItemRemoved={handleRemoveItem}
          onSaveItinerary={handleSaveItinerary}
        />

        {items.length > 0 && (
          <div className="flex justify-center">
            <Button className="w-full sm:w-auto">
              Start Navigation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
