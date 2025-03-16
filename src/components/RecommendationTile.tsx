import { useState } from 'react';
import { MapPin, Star, Clock, Plus, Check, Coffee, Utensils, Camera, Music, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface Recommendation {
  id: string;
  name: string;
  type: 'food' | 'attraction' | 'activity' | 'entertainment';
  image: string;
  location: string;
  rating: number;
  description: string;
  duration: string;
  price: string;
  tags: string[];
}

interface RecommendationTileProps {
  recommendation: Recommendation;
  onAdd: (recommendation: Recommendation) => void;
  isAdded?: boolean;
  isLoading?: boolean;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'food':
      return <Utensils className="h-4 w-4" />;
    case 'attraction':
      return <Camera className="h-4 w-4" />;
    case 'activity':
      return <Bike className="h-4 w-4" />;
    case 'entertainment':
      return <Music className="h-4 w-4" />;
    default:
      return <Coffee className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'food':
      return 'bg-orange-500';
    case 'attraction':
      return 'bg-blue-500';
    case 'activity':
      return 'bg-green-500';
    case 'entertainment':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const RecommendationTile = ({ 
  recommendation, 
  onAdd, 
  isAdded = false,
  isLoading = false
}: RecommendationTileProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden h-[420px] shadow-card animate-pulse">
        <Skeleton className="h-48 w-full" />
        <CardContent className="pt-4">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  const { name, type, image, location, rating, description, duration, price, tags } = recommendation;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden h-full flex flex-col transition-all duration-300",
        isAdded ? "ring-2 ring-primary ring-opacity-50" : "hover:shadow-lg",
        isHovered ? "transform-gpu scale-[1.02]" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bG9uZG9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'} 
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
            <div>
              <Badge
                className="mb-2 text-xs font-normal px-2 py-0.5"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                <span className="flex items-center space-x-1">
                  {getIconForType(type)}
                  <span className="ml-1">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </span>
              </Badge>
              <h3 className="text-white font-semibold line-clamp-1">{name}</h3>
            </div>
            
            <div className="flex items-center bg-black/40 text-white text-sm px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="flex-1 pt-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        <p className="text-sm line-clamp-3 mb-3">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{duration}</span>
          </div>
          <span>{price}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge variant="outline" key={index} className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button
          variant={isAdded ? "outline" : "default"}
          className={cn(
            "w-full group",
            isAdded && "border-primary text-primary hover:bg-primary/5"
          )}
          onClick={() => onAdd(recommendation)}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Itinerary
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
              Add to Itinerary
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendationTile;
