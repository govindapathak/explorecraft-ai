
import type { Recommendation } from '@/components/RecommendationTile';
import { SelectedFilters } from '@/components/FilterCard';

// Mock data for recommendations
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    name: 'Riverside Café',
    type: 'food',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    location: '123 River St, Downtown',
    rating: 4.7,
    description: 'A charming café with riverside views, perfect for a relaxing breakfast or lunch. Known for their artisanal coffee and fresh pastries.',
    duration: '1 hour',
    price: '$$',
    tags: ['Coffee', 'Breakfast', 'Outdoor Seating', 'Wifi']
  },
  {
    id: '2',
    name: 'City Museum',
    type: 'attraction',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzZXVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    location: '456 History Ave, Museum District',
    rating: 4.5,
    description: 'Explore the rich history of the city through interactive exhibits, artifacts, and multimedia presentations. Perfect for history buffs and families.',
    duration: '2 hours',
    price: '$',
    tags: ['History', 'Art', 'Family-Friendly', 'Indoor']
  },
  {
    id: '3',
    name: 'Botanical Gardens',
    type: 'attraction',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym90YW5pY2FsJTIwZ2FyZGVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    location: '789 Flower Blvd, Garden District',
    rating: 4.8,
    description: 'Wander through stunning themed gardens, rare plant collections, and tranquil water features. A peaceful retreat from the hustle and bustle of city life.',
    duration: '1.5 hours',
    price: '$',
    tags: ['Nature', 'Photography', 'Peaceful', 'Wheelchair Accessible']
  },
  {
    id: '4',
    name: 'Adventure Kayaking',
    type: 'activity',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2F5YWtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    location: 'River Sports Center, 101 River Rd',
    rating: 4.6,
    description: 'Guided kayaking tours suitable for beginners and experienced paddlers. Explore the scenic waterways and discover hidden spots only accessible by water.',
    duration: '3 hours',
    price: '$$$',
    tags: ['Adventure', 'Water Sports', 'Guided Tour', 'Active']
  },
  {
    id: '5',
    name: 'Historic Town Square',
    type: 'attraction',
    image: 'https://images.unsplash.com/photo-1616758673872-f9e1fc3eb22e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG93biUyMHNxdWFyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    location: 'Central District',
    rating: 4.4,
    description: 'The heart of the city with historic architecture, charming shops, and street performers. Great place to experience local culture and people-watch.',
    duration: '1 hour',
    price: 'Free',
    tags: ['Historic', 'Shopping', 'People-Watching', 'Wheelchair Accessible']
  },
  {
    id: '6',
    name: 'Sunset Rooftop Bar',
    type: 'entertainment',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vZnRvcCUyMGJhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    location: 'Sky Tower, 800 High St',
    rating: 4.9,
    description: 'Enjoy craft cocktails and spectacular city views from this stylish rooftop bar. The perfect spot to unwind and watch the sunset after a day of exploring.',
    duration: '2 hours',
    price: '$$$',
    tags: ['Cocktails', 'Views', 'Nightlife', 'Romantic']
  }
];

// Simulated API call to fetch recommendations based on location and filters
export async function getRecommendations(
  location: { name: string; coords: { lat: number; lng: number } },
  filters: SelectedFilters = {}
): Promise<Recommendation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real application, we would send these parameters to an actual API
  console.log('Fetching recommendations for:', { location, filters });
  
  // For the mock, just filter the data based on selected filters
  let filteredRecommendations = [...mockRecommendations];
  
  // Apply filters (this is just a simple mock implementation)
  if (filters.accessibility) {
    filteredRecommendations = filteredRecommendations.filter(
      rec => rec.tags.some(tag => tag.toLowerCase().includes('accessible'))
    );
  }
  
  if (filters.ratings) {
    filteredRecommendations = filteredRecommendations.filter(
      rec => rec.rating >= 4.5
    );
  }
  
  // Randomize the order for demo purposes
  return filteredRecommendations
    .sort(() => Math.random() - 0.5)
    .slice(0, 5); // Limit to 5 items for demo
}

// Simulated API call to save an itinerary
export async function saveItinerary(items: Recommendation[]): Promise<{ success: boolean; id: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, we would send the itinerary to a server
  console.log('Saving itinerary:', items);
  
  // Mock successful response
  return {
    success: true,
    id: `itinerary-${Date.now()}`
  };
}

// Simulated AI request for enhanced itinerary
export async function getAIRecommendations(
  location: string,
  preferences: string
): Promise<Recommendation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('AI request parameters:', { location, preferences });
  
  // Return random items from mock data
  return mockRecommendations
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}
