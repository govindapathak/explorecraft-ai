
import type { Recommendation } from '@/components/RecommendationTile';
import { toast } from '@/components/ui/use-toast';

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export async function getLocationInsights(location: Location): Promise<string> {
  return new Promise<string>((resolve) => {
    if (!window.google?.maps?.places) {
      console.error('Google Places API not available for getLocationInsights');
      resolve(`${location.name} - Explore this location and discover nearby attractions.`);
      return;
    }

    console.log('Getting location insights for:', location);
    const { places } = window.google.maps;
    const placesDiv = document.createElement('div');
    const service = new places.PlacesService(placesDiv);
    
    const textSearchRequest = {
      query: `tourist information about ${location.name}`,
      type: 'point_of_interest'
    };
    
    service.textSearch(textSearchRequest, (results, status) => {
      console.log('Location insights search status:', status, 'results:', results?.length || 0);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const firstResult = results[0];
        let insightText = `${location.name} is `;
        
        if (firstResult.name) insightText += `home to ${firstResult.name}. `;
        if (firstResult.formatted_address) insightText += `Located at ${firstResult.formatted_address}. `;
        if (firstResult.rating) insightText += `This area has an average rating of ${firstResult.rating}/5 based on visitor reviews. `;
        if (firstResult.types && firstResult.types.length > 0) {
          const readableTypes = firstResult.types
            .map(type => type.replace(/_/g, ' '))
            .join(', ');
          insightText += `Known for: ${readableTypes}.`;
        }
        
        resolve(insightText);
      } else {
        console.warn('No results for location insights, status:', status);
        resolve(`${location.name} - Explore this location and discover nearby attractions.`);
      }
    });
  });
}

export async function searchNearbyAttractions(
  location: Location, 
  searchRadius: number
): Promise<Recommendation[]> {
  return new Promise<Recommendation[]>((resolve, reject) => {
    console.log('Starting nearby attractions search with radius:', searchRadius);
    
    if (!window.google?.maps?.places) {
      console.error('Google Places API not available for searchNearbyAttractions');
      reject(new Error('Google Places API not available'));
      return;
    }

    const { places } = window.google.maps;
    const placesDiv = document.createElement('div');
    const service = new places.PlacesService(placesDiv);
    
    const requestParams = {
      location: { 
        lat: location.latitude, 
        lng: location.longitude 
      },
      radius: searchRadius,
      type: 'tourist_attraction'
    };
    
    console.log('Nearby search request:', JSON.stringify(requestParams));
    
    service.nearbySearch(
      requestParams,
      (results, status, pagination) => {
        console.log('Places API results status:', status);
        console.log('Places API results count:', results?.length || 0);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const recommendations: Recommendation[] = results
            .filter(place => place.name && place.vicinity)
            .map((place, index) => {
              // Get photo URL if available
              const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 });
              
              const recommendation: Recommendation = {
                id: place.place_id || `place-${index}`,
                name: place.name || 'Unknown Place',
                type: determineAttractationType(place),
                image: photoUrl || 'https://images.unsplash.com/photo-1617339860293-978cf33cce43?q=80&w=1000',
                location: place.vicinity || 'Unknown location',
                rating: place.rating || 4.0,
                description: place.types?.join(', ') || 'Tourist attraction',
                duration: '1-2 hours',
                price: place.price_level ? '$'.repeat(place.price_level) : 'Varies',
                tags: place.types?.map((type: string) => 
                  type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                ) || ['Attraction']
              };
              
              return recommendation;
            });
            
          console.log('Formatted recommendations:', recommendations.length);
          resolve(recommendations);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log('Zero results found for nearby attractions');
          resolve([]);
        } else {
          const errorMsg = `Places API Error: ${status}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      }
    );
  });
}

// Helper function to determine attraction type based on place data
function determineAttractationType(place: any): 'food' | 'attraction' | 'activity' | 'entertainment' {
  const types = place.types || [];
  
  if (types.some(t => t.includes('restaurant') || t.includes('food') || t.includes('cafe'))) {
    return 'food';
  } else if (types.some(t => t.includes('activity') || t.includes('park') || t.includes('trail'))) {
    return 'activity';
  } else if (types.some(t => t.includes('theater') || t.includes('movie') || t.includes('event'))) {
    return 'entertainment';
  }
  
  return 'attraction'; // default case
}
