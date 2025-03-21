
import { useItineraryPage } from '@/hooks/useItineraryPage';
import { useIsMobile } from '@/hooks/use-mobile';
import ItineraryHeader from '@/components/itinerary/ItineraryHeader';
import ItinerarySummary from '@/components/itinerary/ItinerarySummary';
import ItineraryFilters from '@/components/itinerary/ItineraryFilters';
import ItineraryNotices from '@/components/itinerary/ItineraryNotices';
import ItineraryList from '@/components/ItineraryList';
import StartNavigationButton from '@/components/itinerary/StartNavigationButton';

const Itinerary = () => {
  const {
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
  } = useItineraryPage();
  
  const isMobile = useIsMobile();

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <ItineraryHeader />

      <div className="grid grid-cols-1 gap-6">
        <ItinerarySummary 
          onFindNearbyAttractions={handleFindNearbyAttractions}
          onManualLocation={handleManualLocation}
          onShareItinerary={handleShareItinerary}
          onSaveItinerary={handleSaveItinerary}
          isLocating={isLocating}
          isLoading={isLoading}
        />

        <ItineraryFilters 
          onFilterChange={handleIconFilterChange}
          vertical={!isMobile}
        />

        <ItineraryNotices 
          locationInsights={locationInsights}
          currentLocation={currentLocation}
          isLoading={isLoading}
          placesCount={places.length}
        />

        <ItineraryList 
          items={items}
          onItemsReordered={handleReorderItems}
          onItemRemoved={handleRemoveItem}
          onSaveItinerary={handleSaveItinerary}
        />

        <StartNavigationButton itemsCount={items.length} />
      </div>
    </div>
  );
};

export default Itinerary;
