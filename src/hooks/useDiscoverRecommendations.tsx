
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { Recommendation } from '@/components/RecommendationTile';

interface UserPreferences {
  location: {
    name: string;
    coords: { lat: number; lng: number };
  };
  likes: string[];
  dislikes: string[];
  customFilters: string[];
}

export function useDiscoverRecommendations() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Recommendation[]>([]);
  
  const {
    recommendations,
    isLoading: isGeneratingRecommendations,
    isUsingFallback,
    generateRecommendations,
    hasRecommendations
  } = useAIRecommendations();
  
  const handleAddToItinerary = (item: Recommendation) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      toast({
        title: "Added to itinerary",
        description: `${item.name} has been added to your itinerary.`
      });
    }
  };
  
  const handleCreateItinerary = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one attraction for your itinerary.",
        variant: "destructive"
      });
      return;
    }
    
    // Store selected items for the itinerary page
    localStorage.setItem('itineraryItems', JSON.stringify(selectedItems));
    navigate('/itinerary');
  };
  
  const handleGenerateRecommendations = (userPreferences: UserPreferences | null) => {
    if (!userPreferences) {
      toast({
        title: "No preferences set",
        description: "Please select a location and at least one filter to generate recommendations.",
        variant: "default"
      });
      return;
    }
    
    if (userPreferences.likes.length === 0) {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to generate personalized recommendations.",
        variant: "default"
      });
      return;
    }
    
    generateRecommendations(userPreferences);
  };
  
  return {
    selectedItems,
    recommendations,
    isGeneratingRecommendations,
    isUsingFallback,
    hasRecommendations,
    handleAddToItinerary,
    handleCreateItinerary,
    handleGenerateRecommendations
  };
}
