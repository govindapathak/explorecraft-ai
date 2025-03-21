
import { Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RecommendationTile, { Recommendation } from '@/components/RecommendationTile';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  onAddToItinerary: (item: Recommendation) => void;
  selectedItems: Recommendation[];
  isUsingFallback?: boolean;
}

const RecommendationsList = ({ 
  recommendations, 
  onAddToItinerary, 
  selectedItems,
  isUsingFallback = false
}: RecommendationsListProps) => {
  // Early return if recommendations are not an array or empty
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
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
        <Alert variant="default" className="mb-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            Using offline recommendations due to AI service limitations. These recommendations are based on your preferences but may be less personalized.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((recommendation, index) => (
          <RecommendationTile
            key={recommendation.id || `rec-${index}-${Math.random()}`}
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
