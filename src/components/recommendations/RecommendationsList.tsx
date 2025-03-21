
import { Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RecommendationTile from '@/components/RecommendationTile';

interface RecommendationsListProps {
  recommendations: any[];
  onAddToItinerary: (item: any) => void;
  selectedItems: any[];
  isUsingFallback?: boolean;
}

const RecommendationsList = ({ 
  recommendations, 
  onAddToItinerary, 
  selectedItems,
  isUsingFallback = false
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

      {isUsingFallback && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Using offline recommendations due to AI service limitations. These recommendations are based on your preferences but may be less personalized.
          </AlertDescription>
        </Alert>
      )}

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
