
import { useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from '@/hooks/useLocation';
import LocationSection, { LocationData } from '@/components/preferences/LocationSection';
import CategoriesSection, { Category } from '@/components/preferences/CategoriesSection';
import CustomFiltersSection from '@/components/preferences/CustomFiltersSection';
import QuickFiltersSection from '@/components/preferences/QuickFiltersSection';

const PreferencesPage = () => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { currentLocation } = useLocation();
  const [likedCategories, setLikedCategories] = useState<string[]>([]);
  const [dislikedCategories, setDislikedCategories] = useState<string[]>([]);
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  // Initialize location from different sources
  useEffect(() => {
    // Try to get location from router state first (from LocationPermission page)
    const locationFromState = routerLocation.state?.location as LocationData | undefined;
    
    // Then try localStorage (might be set from LocationPermission or manual input)
    const savedLocationJSON = localStorage.getItem('userLocation');
    const savedLocation = savedLocationJSON ? JSON.parse(savedLocationJSON) as LocationData : null;
    
    // Finally fallback to currentLocation from useLocation hook
    const locationFromHook = currentLocation ? {
      name: "Current Location",
      coords: { 
        lat: currentLocation.latitude, 
        lng: currentLocation.longitude 
      }
    } : null;
    
    // Use the first available location
    setSelectedLocation(locationFromState || savedLocation || locationFromHook);
    
    // Load any saved preferences if they exist
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
    // Save to localStorage for persistence
    localStorage.setItem('userLocation', JSON.stringify(location));
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

    // Store preferences in localStorage for now
    localStorage.setItem('userPreferences', JSON.stringify({
      location: selectedLocation,
      likes: likedCategories,
      dislikes: dislikedCategories,
      customFilters: customFilters
    }));
    
    // Navigate to the attractions discovery page
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
