
import { useDiscoverLocation } from '@/hooks/useDiscoverLocation';
import { useDiscoverFilters } from '@/hooks/useDiscoverFilters';
import { useDiscoverRecommendations } from '@/hooks/useDiscoverRecommendations';
import { Recommendation } from '@/components/RecommendationTile';
import { type Location } from '@/services/placesSearchService';

export function useDiscoverPage() {
  const {
    userLocation,
    showLocationPrompt,
    places,
    isLoadingPlaces,
    locationInsights,
    apiError,
    retryLoadingApi,
    handleLocationSelected
  } = useDiscoverLocation();
  
  const {
    userPreferences,
    selectedFilters,
    iconFilter,
    handleFiltersChanged,
    handleIconFilterChange,
    getCurrentPreferences
  } = useDiscoverFilters(userLocation);
  
  const {
    selectedItems,
    recommendations,
    isGeneratingRecommendations,
    isUsingFallback,
    hasRecommendations,
    handleAddToItinerary,
    handleCreateItinerary,
    handleGenerateRecommendations: generateRecommendations
  } = useDiscoverRecommendations();
  
  // Generate recommendations when filters change
  const handleGenerateRecommendations = () => {
    const currentPreferences = getCurrentPreferences();
    if (currentPreferences) {
      console.log('Generating recommendations with preferences:', currentPreferences);
      generateRecommendations(currentPreferences);
    } else {
      console.error('Failed to get current preferences');
    }
  };
  
  // Filter displayed recommendations based on active filters
  // Make sure we have a fallback in case both are empty
  const displayedAttractions = hasRecommendations ? recommendations : 
    (places && places.length > 0 ? places : []);
  
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
