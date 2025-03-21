
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import type { Recommendation } from '@/components/RecommendationTile';
import { FilterCategory } from '@/components/IconFilters';

export function useItineraryPage() {
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
  
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  const { currentLocation, isLocating, getCurrentLocation } = useLocation();
  const { places, isLoading, isApiLoaded, locationInsights, searchNearbyPlaces } = useNearbyPlaces();
  
  // When places are loaded, update the items
  useEffect(() => {
    if (places.length > 0) {
      // Merge new places with existing ones, avoiding duplicates
      setItems(prevItems => {
        const existingIds = new Set(prevItems.map(item => item.id));
        const newPlaces = places.filter(place => !existingIds.has(place.id));
        return [...prevItems, ...newPlaces];
      });
      
      if (places.length > 0) {
        toast({
          title: "Itinerary updated",
          description: `Added ${places.length} nearby attractions to your itinerary.`
        });
      }
    }
  }, [places]);

  const handleIconFilterChange = (filter: FilterCategory | null) => {
    setIconFilter(filter);
    // In a real app, this would filter the items based on the selected category
    console.log('Icon filter changed:', filter);
  };

  const handleDetectLocation = async () => {
    try {
      const location = await getCurrentLocation();
      
      if (location) {
        toast({
          title: "Location detected",
          description: `Found you at: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
        });
        
        // Now search for places
        searchNearbyPlaces();
      }
    } catch (error) {
      console.error('Location detection error:', error);
      toast({
        title: "Location error",
        description: "Unable to detect your location. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const handleFindNearbyAttractions = () => {
    if (!currentLocation) {
      handleDetectLocation();
    } else {
      searchNearbyPlaces();
    }
  };

  const handleManualLocation = (location: { name: string; latitude: number; longitude: number }) => {
    searchNearbyPlaces(location);
  };

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

  return {
    items,
    iconFilter,
    currentLocation,
    isLocating,
    isLoading,
    locationInsights,
    places,
    handleIconFilterChange,
    handleFindNearbyAttractions,
    handleManualLocation,
    handleReorderItems,
    handleRemoveItem,
    handleSaveItinerary,
    handleShareItinerary
  };
}
