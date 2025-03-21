
import { useIsMobile } from '@/hooks/use-mobile';
import { useDiscoverPage } from '@/hooks/useDiscoverPage';
import LocationPrompt from '@/components/discover/LocationPrompt';
import DiscoverSidebar from '@/components/discover/DiscoverSidebar';
import DiscoverContent from '@/components/discover/DiscoverContent';

const DiscoverPage = () => {
  const isMobile = useIsMobile();
  const {
    userPreferences,
    showLocationPrompt,
    isLoadingPlaces,
    isGeneratingRecommendations,
    locationInsights,
    apiError,
    retryLoadingApi,
    hasRecommendations,
    recommendations,
    isUsingFallback,
    places,
    displayedAttractions,
    selectedItems,
    handleFiltersChanged,
    handleIconFilterChange,
    handleAddToItinerary,
    handleCreateItinerary,
    handleLocationSelected,
    handleGenerateRecommendations
  } = useDiscoverPage();

  if (showLocationPrompt) {
    return <LocationPrompt onLocationSelected={handleLocationSelected} />;
  }
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Discover attractions</h1>
        <p className="text-muted-foreground">
          {locationInsights || 
           (userPreferences?.location ? 
            `Exploring attractions near ${userPreferences.location.name}` : 
            "Find attractions based on your preferences")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        {/* Sidebar with Filters */}
        <DiscoverSidebar 
          onFilterChange={handleIconFilterChange}
          onFiltersChanged={handleFiltersChanged}
          onLocationSelected={handleLocationSelected}
          initialLocation={userPreferences?.location || null}
          onGenerateRecommendations={handleGenerateRecommendations}
          isGeneratingRecommendations={isGeneratingRecommendations}
          isMobile={isMobile}
        />
        
        {/* Main Content */}
        <DiscoverContent 
          isLoadingPlaces={isLoadingPlaces}
          isGeneratingRecommendations={isGeneratingRecommendations}
          apiError={apiError}
          retryLoadingApi={retryLoadingApi}
          displayedAttractions={displayedAttractions}
          hasRecommendations={hasRecommendations}
          recommendations={recommendations}
          isUsingFallback={isUsingFallback}
          places={places}
          handleAddToItinerary={handleAddToItinerary}
          selectedItems={selectedItems}
          handleCreateItinerary={handleCreateItinerary}
          handleIconFilterChange={handleIconFilterChange}
          isMobile={isMobile}
          locationInsights={locationInsights}
          userLocationName={userPreferences?.location?.name}
        />
      </div>
    </div>
  );
};

export default DiscoverPage;
