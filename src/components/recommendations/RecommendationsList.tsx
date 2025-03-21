
import { Sparkles } from 'lucide-react';
import RecommendationTile from '@/components/RecommendationTile';

interface RecommendationsListProps {
  recommendations: any[];
  onAddToItinerary: (item: any) => void;
  selectedItems: any[];
}

const RecommendationsList = ({ 
  recommendations, 
  onAddToItinerary, 
  selectedItems 
}: RecommendationsListProps) => {
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
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
            onAdd={onAddToItinerary}
            isAdded={selectedItems.some(item => item.id === recommendation.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
