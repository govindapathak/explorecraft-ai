
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface ManualLocationInputProps {
  onLocationSubmit: (location: { name: string; latitude: number; longitude: number }) => void;
  isLoading?: boolean;
}

const ManualLocationInput = ({ onLocationSubmit, isLoading = false }: ManualLocationInputProps) => {
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!locationName.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for this location",
        variant: "destructive"
      });
      return;
    }
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude and longitude values",
        variant: "destructive"
      });
      return;
    }
    
    if (lat < -90 || lat > 90) {
      toast({
        title: "Invalid latitude",
        description: "Latitude must be between -90 and 90 degrees",
        variant: "destructive"
      });
      return;
    }
    
    if (lng < -180 || lng > 180) {
      toast({
        title: "Invalid longitude",
        description: "Longitude must be between -180 and 180 degrees",
        variant: "destructive"
      });
      return;
    }
    
    onLocationSubmit({
      name: locationName,
      latitude: lat,
      longitude: lng
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="location-name">Location Name</Label>
          <Input
            id="location-name"
            placeholder="e.g. Downtown San Francisco"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="address">Address (optional)</Label>
          <Textarea
            id="address"
            placeholder="Enter full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            className="min-h-[60px]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="text"
              placeholder="e.g. 37.7749"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="text" 
              placeholder="e.g. -122.4194"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search This Location
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ManualLocationInput;
