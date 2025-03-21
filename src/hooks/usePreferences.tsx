
import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { LocationData } from '@/components/preferences/LocationSection';
import { Category } from '@/components/preferences/CategoriesSection';

export interface UserPreferences {
  location: LocationData | null;
  likes: string[];
  dislikes: string[];
  customFilters: string[];
}

export function usePreferences() {
  const routerLocation = useRouterLocation();
  const { currentLocation } = useLocation();
  const [likedCategories, setLikedCategories] = useState<string[]>([]);
  const [dislikedCategories, setDislikedCategories] = useState<string[]>([]);
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  
  const { 
    recommendations, 
    isLoading: isGeneratingRecommendations, 
    generateRecommendations 
  } = useAIRecommendations();

  useEffect(() => {
    const locationFromState = routerLocation.state?.location as LocationData | undefined;
    const savedLocationJSON = localStorage.getItem('userLocation');
    const savedLocation = savedLocationJSON ? JSON.parse(savedLocationJSON) as LocationData : null;
    const locationFromHook = currentLocation ? {
      name: "Current Location",
      coords: { 
        lat: currentLocation.latitude, 
        lng: currentLocation.longitude 
      }
    } : null;
    
    setSelectedLocation(locationFromState || savedLocation || locationFromHook);

    const savedPrefsJSON = localStorage.getItem('userPreferences');
    if (savedPrefsJSON) {
      try {
        const savedPrefs = JSON.parse(savedPrefsJSON);
        if (savedPrefs.likes) setLikedCategories(savedPrefs.likes);
        if (savedPrefs.dislikes) setDislikedCategories(savedPrefs.dislikes);
        if (savedPrefs.customFilters) setCustomFilters(savedPrefs.customFilters);
      } catch (e) {
        console.error('Error parsing saved preferences:', e);
      }
    }
  }, [currentLocation, routerLocation.state]);

  const handleLike = (category: Category) => {
    if (dislikedCategories.includes(category.id)) {
      setDislikedCategories(dislikedCategories.filter(id => id !== category.id));
    }
    
    if (likedCategories.includes(category.id)) {
      setLikedCategories(likedCategories.filter(id => id !== category.id));
    } else {
      setLikedCategories([...likedCategories, category.id]);
    }
  };

  const handleDislike = (category: Category) => {
    if (likedCategories.includes(category.id)) {
      setLikedCategories(likedCategories.filter(id => id !== category.id));
    }
    
    if (dislikedCategories.includes(category.id)) {
      setDislikedCategories(dislikedCategories.filter(id => id !== category.id));
    } else {
      setDislikedCategories([...dislikedCategories, category.id]);
    }
  };

  const handleAddCustomFilter = (filter: string) => {
    setCustomFilters([...customFilters, filter]);
  };

  const handleRemoveCustomFilter = (filter: string) => {
    setCustomFilters(customFilters.filter(f => f !== filter));
  };

  const handleLocationSelected = (location: LocationData) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const handleGenerateRecommendations = () => {
    if (!selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select a location to generate recommendations",
        variant: "destructive"
      });
      return;
    }

    if (likedCategories.length === 0) {
      toast({
        title: "Preferences required",
        description: "Please select at least one category you like",
        variant: "destructive"
      });
      return;
    }

    const userPreferences = {
      location: selectedLocation,
      likes: likedCategories,
      dislikes: dislikedCategories,
      customFilters
    };

    generateRecommendations(userPreferences);
  };

  const handleAddToItinerary = (item: any) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
      toast({
        title: "Added to itinerary",
        description: `${item.name} has been added to your itinerary.`
      });
    }
  };
  
  const savePreferences = () => {
    if (!selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select a location to continue",
        variant: "destructive"
      });
      return false;
    }

    if (likedCategories.length === 0) {
      toast({
        title: "Preferences required",
        description: "Please select at least one category you like",
        variant: "destructive"
      });
      return false;
    }

    localStorage.setItem('userPreferences', JSON.stringify({
      location: selectedLocation,
      likes: likedCategories,
      dislikes: dislikedCategories,
      customFilters: customFilters
    }));
    
    if (selectedItems.length > 0) {
      localStorage.setItem('itineraryItems', JSON.stringify(selectedItems));
    }
    
    return true;
  };

  return {
    selectedLocation,
    likedCategories,
    dislikedCategories,
    customFilters,
    recommendations,
    selectedItems,
    isGeneratingRecommendations,
    handleLike,
    handleDislike,
    handleAddCustomFilter,
    handleRemoveCustomFilter,
    handleLocationSelected,
    handleGenerateRecommendations,
    handleAddToItinerary,
    savePreferences
  };
}
