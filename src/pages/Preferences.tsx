
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '@/hooks/usePreferences';
import LocationSection from '@/components/preferences/LocationSection';
import CategoriesSection from '@/components/preferences/CategoriesSection';
import CustomFiltersSection from '@/components/preferences/CustomFiltersSection';
import QuickFiltersSection from '@/components/preferences/QuickFiltersSection';
import PreferencesFooter from '@/components/preferences/PreferencesFooter';
import RecommendationsList from '@/components/recommendations/RecommendationsList';

const PreferencesPage = () => {
  const navigate = useNavigate();
  const {
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
  } = usePreferences();

  const handleNext = () => {
    if (savePreferences()) {
      navigate('/discover');
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Tell us what you like</h1>
          <p className="text-muted-foreground">
            This helps us find attractions that match your interests
          </p>
        </div>

        <LocationSection 
          selectedLocation={selectedLocation} 
          onLocationSelected={handleLocationSelected}
          onGenerateRecommendations={handleGenerateRecommendations}
          isGeneratingRecommendations={isGeneratingRecommendations}
        />

        <CategoriesSection 
          likedCategories={likedCategories}
          dislikedCategories={dislikedCategories}
          onLike={handleLike}
          onDislike={handleDislike}
        />

        <CustomFiltersSection
          customFilters={customFilters}
          onAddFilter={handleAddCustomFilter}
          onRemoveFilter={handleRemoveCustomFilter}
        />

        <QuickFiltersSection
          onFilterChange={(filter) => console.log('Filter selected:', filter)}
        />

        {recommendations.length > 0 && (
          <RecommendationsList
            recommendations={recommendations}
            onAddToItinerary={handleAddToItinerary}
            selectedItems={selectedItems}
          />
        )}

        <PreferencesFooter onNext={handleNext} />
      </div>
    </div>
  );
};

export default PreferencesPage;
