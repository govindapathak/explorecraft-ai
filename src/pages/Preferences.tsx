
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import IconFilters from '@/components/IconFilters';
import LocationSelector from '@/components/LocationSelector';
import { useLocation } from '@/hooks/useLocation';

// Attraction categories
const categories = [
  { id: 'museums', name: 'Museums', emoji: '🏛️' },
  { id: 'parks', name: 'Parks & Nature', emoji: '🌳' },
  { id: 'restaurants', name: 'Food & Drinks', emoji: '🍽️' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎭' },
  { id: 'historical', name: 'Historical Sites', emoji: '🏰' },
  { id: 'beaches', name: 'Beaches', emoji: '🏖️' },
  { id: 'nightlife', name: 'Nightlife', emoji: '🌃' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'wellness', name: 'Spas & Wellness', emoji: '💆' },
  { id: 'art', name: 'Art Galleries', emoji: '🎨' },
  { id: 'tours', name: 'Tours & Activities', emoji: '🧭' },
];

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface LocationData {
  name: string;
  coords: { lat: number; lng: number };
}

const PreferencesPage = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocation();
  const [likedCategories, setLikedCategories] = useState<string[]>([]);
  const [dislikedCategories, setDislikedCategories] = useState<string[]>([]);
  const [customFilter, setCustomFilter] = useState('');
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    currentLocation ? {
      name: "Current Location",
      coords: { 
        lat: currentLocation.latitude, 
        lng: currentLocation.longitude 
      }
    } : null
  );

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

  const handleAddCustomFilter = () => {
    if (customFilter.trim() && !customFilters.includes(customFilter.trim())) {
      setCustomFilters([...customFilters, customFilter.trim()]);
      setCustomFilter('');
    }
  };

  const handleRemoveCustomFilter = (filter: string) => {
    setCustomFilters(customFilters.filter(f => f !== filter));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomFilter();
    }
  };

  const handleLocationSelected = (location: LocationData) => {
    setSelectedLocation(location);
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
    // In a real app, this would likely be stored in a database
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Location</h2>
          <Card>
            <CardContent className="pt-6">
              <LocationSelector onLocationSelected={handleLocationSelected} />
              {selectedLocation && (
                <div className="mt-4 py-2 px-3 bg-primary/10 text-primary rounded-md">
                  Using: {selectedLocation.name}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">Tap on the icons to like or dislike categories</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.emoji}</span>
                      <span>{category.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="icon"
                        variant={likedCategories.includes(category.id) ? "default" : "ghost"}
                        className="h-8 w-8"
                        onClick={() => handleLike(category)}
                      >
                        <Heart className={likedCategories.includes(category.id) ? "fill-current" : ""} size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant={dislikedCategories.includes(category.id) ? "destructive" : "ghost"}
                        className="h-8 w-8"
                        onClick={() => handleDislike(category)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Filters</h2>
          <p className="text-sm text-muted-foreground">
            Add specific requirements for your attractions
          </p>
          
          <div className="flex space-x-2">
            <Input
              placeholder="e.g. pet friendly, wheelchair accessible"
              value={customFilter}
              onChange={(e) => setCustomFilter(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddCustomFilter}>Add</Button>
          </div>
          
          {customFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {customFilters.map((filter) => (
                <div 
                  key={filter} 
                  className="bg-secondary text-secondary-foreground py-1 px-3 rounded-full text-sm flex items-center"
                >
                  {filter}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 hover:bg-destructive/10" 
                    onClick={() => handleRemoveCustomFilter(filter)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Filters</h2>
          <IconFilters onFilterChange={(filter) => console.log('Filter selected:', filter)} />
        </div>

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
