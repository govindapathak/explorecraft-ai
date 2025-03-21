
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { useLocation } from '@/hooks/useLocation';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { FilterCategory } from '@/components/IconFilters';
import { SelectedFilters } from '@/components/FilterCard';
import { Recommendation } from '@/components/RecommendationTile';
import { type Location } from '@/services/placesSearchService';

interface UserPreferences {
  location: {
    name: string;
    coords: { lat: number; lng: number };
  };
  likes: string[];
  dislikes: string[];
  customFilters: string[];
}

export function useDiscoverPage() {
  const navigate = useNavigate();
  const { currentLocation, getCurrentLocation } = useLocation();
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<Recommendation[]>([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  
  const { 
    places, 
    isLoading: isLoadingPlaces, 
    locationInsights,
    searchNearbyPlaces,
    apiError,
    retryLoadingApi
  } = useNearbyPlaces(30000); // 30km ~ 18.6 miles

  const {
    recommendations,
    isLoading: isGeneratingRecommendations,
    isUsingFallback,
    generateRecommendations,
    hasRecommendations
  } = useAIRecommendations();
  
  // Try to load user location automatically
  useEffect(() => {
    const tryGetLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          const locationData = {
            name: "Current Location",
            coords: { 
              lat: location.latitude, 
              lng: location.longitude 
            }
          };
          handleLocationSelected(locationData);
          setShowLocationPrompt(false);
        }
      } catch (error) {
        console.log('Could not automatically get location, showing prompt');
      }
    };
    
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        handleLocationSelected(parsedLocation);
        setShowLocationPrompt(false);
      } catch (e) {
        tryGetLocation();
      }
    } else {
      tryGetLocation();
    }
  }, []);
  
  // Set up preferences based on selected location and filters
  useEffect(() => {
    if (userPreferences?.location) {
      const activeFilters = Object.keys(selectedFilters).filter(key => selectedFilters[key]);
      
      // Add icon filter if selected
      let likes = [...(activeFilters || [])];
      if (iconFilter) {
        likes.push(iconFilter);
      }
      
      // Make sure we have unique values
      likes = [...new Set(likes)];
      
      if (likes.length > 0) {
        const updatedPreferences = {
          ...userPreferences,
          likes,
          dislikes: []
        };
        setUserPreferences(updatedPreferences);
        
        // Generate AI recommendations when filters change
        generateRecommendations(updatedPreferences);
      }
    }
  }, [selectedFilters, iconFilter]);
  
  const handleFiltersChanged = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
  };

  const handleIconFilterChange = (filter: FilterCategory | null) => {
    setIconFilter(filter);
  };
  
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
  
  const handleLocationSelected = (location: Location) => {
    localStorage.setItem('userLocation', JSON.stringify(location));
    setShowLocationPrompt(false);
    
    // Search for nearby places when location is selected
    searchNearbyPlaces({
      name: location.name,
      latitude: location.coords.lat,
      longitude: location.coords.lng
    });
    
    // Update preferences with new location
    setUserPreferences({
      location,
      likes: [],
      dislikes: [],
      customFilters: []
    });
  };
  
  const handleGenerateRecommendations = () => {
    if (!userPreferences) return;
    
    const activeFilters = Object.keys(selectedFilters).filter(key => selectedFilters[key]);
    
    // Add icon filter if selected
    let likes = [...(activeFilters || [])];
    if (iconFilter) {
      likes.push(iconFilter);
    }
    
    // Make sure we have unique values
    likes = [...new Set(likes)];
    
    if (likes.length === 0) {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to generate personalized recommendations.",
        variant: "default"
      });
      return;
    }
    
    const updatedPreferences = {
      ...userPreferences,
      likes,
      dislikes: []
    };
    
    generateRecommendations(updatedPreferences);
  };
  
  // Filter displayed recommendations based on active filters
  const displayedAttractions = hasRecommendations ? recommendations : places;

  return {
    userPreferences,
    selectedFilters,
    iconFilter,
    selectedItems,
    showLocationPrompt,
    places,
    isLoadingPlaces,
    locationInsights,
    apiError,
    retryLoadingApi,
    recommendations,
    isGeneratingRecommendations,
    isUsingFallback,
    hasRecommendations,
    displayedAttractions,
    handleFiltersChanged,
    handleIconFilterChange,
    handleAddToItinerary,
    handleCreateItinerary,
    handleLocationSelected,
    handleGenerateRecommendations
  };
}
