
import { useState } from 'react';
import CategoryCard from './CategoryCard';

// Attraction categories
export const categories = [
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

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface CategoriesSectionProps {
  likedCategories: string[];
  dislikedCategories: string[];
  onLike: (category: Category) => void;
  onDislike: (category: Category) => void;
}

const CategoriesSection = ({ 
  likedCategories, 
  dislikedCategories, 
  onLike, 
  onDislike 
}: CategoriesSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <p className="text-sm text-muted-foreground">Tap on the icons to like or dislike categories</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isLiked={likedCategories.includes(category.id)}
            isDisliked={dislikedCategories.includes(category.id)}
            onLike={onLike}
            onDislike={onDislike}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
export { categories };
