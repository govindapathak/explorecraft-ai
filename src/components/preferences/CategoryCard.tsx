
import { Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface CategoryCardProps {
  category: Category;
  isLiked: boolean;
  isDisliked: boolean;
  onLike: (category: Category) => void;
  onDislike: (category: Category) => void;
}

const CategoryCard = ({ category, isLiked, isDisliked, onLike, onDislike }: CategoryCardProps) => {
  return (
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
              variant={isLiked ? "default" : "ghost"}
              className="h-8 w-8"
              onClick={() => onLike(category)}
            >
              <Heart className={isLiked ? "fill-current" : ""} size={16} />
            </Button>
            <Button
              size="icon"
              variant={isDisliked ? "destructive" : "ghost"}
              className="h-8 w-8"
              onClick={() => onDislike(category)}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
