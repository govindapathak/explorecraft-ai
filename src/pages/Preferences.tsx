import { useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import LocationSection, { LocationData } from '@/components/preferences/LocationSection';
import CategoriesSection, { Category } from '@/components/preferences/CategoriesSection';
import CustomFiltersSection from '@/components/preferences/CustomFiltersSection';
import QuickFiltersSection from '@/components/preferences/QuickFiltersSection';
import RecommendationTile from '@/components/RecommendationTile';

const PreferencesPage = () => {
  const navigate = useNavigate();
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

  const handleNext = () => {
    if (!selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select a location to continue",
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

    localStorage.setItem('userPreferences', JSON.stringify({
      location: selectedLocation,
      likes: likedCategories,
      dislikes: dislikedCategories,
      customFilters: customFilters
    }));
    
    if (selectedItems.length > 0) {
      localStorage.setItem('itineraryItems', JSON.stringify(selectedItems));
    }
    
    navigate('/discover');
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Based on your preferences, you might enjoy these attractions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map(recommendation => (
                <RecommendationTile
                  key={recommendation.id}
                  recommendation={recommendation}
                  onAdd={handleAddToItinerary}
                  isAdded={selectedItems.some(item => item.id === recommendation.id)}
                />
              ))}
            </div>
          </div>
        )}

        <Button 
          size="lg" 
          className="w-full mt-6" 
          onClick={handleNext}
        >
          Find Attractions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PreferencesPage;
