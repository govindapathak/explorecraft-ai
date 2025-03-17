
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
      resolve(`${location.name} - Explore this location and discover nearby attractions.`);
      return;
    }

    const { places } = window.google.maps;
    const placesDiv = document.createElement('div');
    const service = new places.PlacesService(placesDiv);
    
    const textSearchRequest = {
      query: `tourist information about ${location.name}`,
      type: 'point_of_interest'
    };
    
    service.textSearch(textSearchRequest, (results, status) => {
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
    if (!window.google?.maps?.places) {
      reject(new Error('Google Places API not available'));
      return;
    }

    const { places } = window.google.maps;
    const placesDiv = document.createElement('div');
    const service = new places.PlacesService(placesDiv);
    
    service.nearbySearch(
      {
        location: { 
          lat: location.latitude, 
          lng: location.longitude 
        },
        radius: searchRadius,
        type: 'tourist_attraction'
      },
      (results, status) => {
        console.log('Places API results:', status, results?.length);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const recommendations: Recommendation[] = results
            .filter(place => place.name && place.vicinity)
            .map((place, index) => {
              // Get photo URL if available
              const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 });
              
              return {
                id: place.place_id || `place-${index}`,
                name: place.name || 'Unknown Place',
                type: 'attraction',
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
            });
            
          console.log('Formatted recommendations:', recommendations.length);
          resolve(recommendations);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          console.error('Places API error:', status);
          reject(new Error(`API Error: ${status}`));
        }
      }
    );
  });
}
