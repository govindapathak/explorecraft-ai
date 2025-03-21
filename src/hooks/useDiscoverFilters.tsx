
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { FilterCategory } from '@/components/IconFilters';
import { SelectedFilters } from '@/components/FilterCard';
import { type Location } from '@/services/placesSearchService';

interface UserPreferences {
  location: Location;
  likes: string[];
  dislikes: string[];
  customFilters: string[];
}

export function useDiscoverFilters(userLocation: Location | null) {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [iconFilter, setIconFilter] = useState<FilterCategory | null>(null);
  
  // Update preferences when location or filters change
  useEffect(() => {
    if (userLocation) {
      const updatedPreferences = {
        location: userLocation,
        likes: [],
        dislikes: [],
        customFilters: []
      };
      setUserPreferences(updatedPreferences);
    }
  }, [userLocation]);
  
  // Update preferences when filters change
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
      }
    }
  }, [selectedFilters, iconFilter]);

  const handleFiltersChanged = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
  };

  const handleIconFilterChange = (filter: FilterCategory | null) => {
    setIconFilter(filter);
  };
  
  const getCurrentPreferences = (): UserPreferences | null => {
    if (!userPreferences) return null;
    
    const activeFilters = Object.keys(selectedFilters).filter(key => selectedFilters[key]);
    
    // Add icon filter if selected
    let likes = [...(activeFilters || [])];
    if (iconFilter) {
      likes.push(iconFilter);
    }
    
    // Make sure we have unique values
    likes = [...new Set(likes)];
    
    return {
      ...userPreferences,
      likes,
      dislikes: []
    };
  };
  
  return {
    userPreferences,
    selectedFilters,
    iconFilter,
    handleFiltersChanged,
    handleIconFilterChange,
    getCurrentPreferences
  };
}
