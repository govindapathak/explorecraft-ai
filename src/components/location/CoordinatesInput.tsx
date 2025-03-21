
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CoordinatesInputProps {
  locationName: string;
  setLocationName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
  isLoading?: boolean;
}

const CoordinatesInput = ({
  locationName,
  setLocationName,
  address,
  setAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  isLoading = false
}: CoordinatesInputProps) => {
  return (
    <div className="bg-card rounded-lg p-4 border mt-4">
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
      
      <div className="space-y-1 mt-3">
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
      
      <div className="grid grid-cols-2 gap-3 mt-3">
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
    </div>
  );
};

export default CoordinatesInput;
