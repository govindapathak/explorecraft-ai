
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';

interface ManualLocationInputProps {
  onLocationSubmit: (location: { name: string; latitude: number; longitude: number }) => void;
  isLoading: boolean;
}

const locationSchema = z.object({
  locationName: z.string().min(2, { message: "Location name must be at least 2 characters" }),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const ManualLocationInput = ({ onLocationSubmit, isLoading }: ManualLocationInputProps) => {
  const [open, setOpen] = useState(false);
  const [isAutocompleteReady, setIsAutocompleteReady] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      locationName: '',
      latitude: 0,
      longitude: 0,
    },
  });

  // Initialize Google Places Autocomplete when the dialog opens
  useEffect(() => {
    if (open && window.google?.maps?.places && autocompleteInputRef.current) {
      // Initialize autocomplete only if not already initialized
      if (!autocompleteRef.current) {
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(
            autocompleteInputRef.current,
            { types: ['geocode'] }
          );
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (place.geometry && place.geometry.location) {
              form.setValue('locationName', place.name || place.formatted_address || '');
              form.setValue('latitude', place.geometry.location.lat());
              form.setValue('longitude', place.geometry.location.lng());
              setIsAutocompleteReady(true);
            }
          });
          
          autocompleteRef.current = autocomplete;
          setIsAutocompleteReady(true);
          
        } catch (error) {
          console.error('Error initializing Places Autocomplete:', error);
          toast({
            title: "Google Maps error",
            description: "Couldn't initialize location search. You can still enter coordinates manually.",
            variant: "destructive"
          });
        }
      }
    }
    
    return () => {
      // Clean up autocomplete instance when dialog closes
      if (!open && autocompleteRef.current) {
        autocompleteRef.current = null;
      }
    };
  }, [open, form]);

  const handleSubmit = (values: LocationFormValues) => {
    onLocationSubmit({
      name: values.locationName,
      latitude: values.latitude,
      longitude: values.longitude
    });
    setOpen(false);
  };
  
  const handleSearchClick = () => {
    if (autocompleteInputRef.current) {
      // Trigger the native "select all" behavior to encourage the user to start typing
      autocompleteInputRef.current.select();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <MapPin className="h-4 w-4 mr-2" />
          Enter location manually
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter location</DialogTitle>
          <DialogDescription>
            Search for a location or enter coordinates manually to find nearby attractions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="locationName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Location search</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Search for a location..."
                        ref={(e) => {
                          field.ref(e);
                          autocompleteInputRef.current = e;
                        }}
                        onChange={field.onChange}
                        value={field.value}
                        onClick={handleSearchClick}
                        className="pr-9"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-full aspect-square"
                      tabIndex={-1}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 48.8566" 
                        step="any"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2.3522" 
                        step="any"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Find attractions
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualLocationInput;
