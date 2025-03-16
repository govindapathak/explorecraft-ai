
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      locationName: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const handleSubmit = (values: LocationFormValues) => {
    onLocationSubmit({
      name: values.locationName,
      latitude: values.latitude,
      longitude: values.longitude
    });
    setOpen(false);
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
          <DialogTitle>Enter location coordinates</DialogTitle>
          <DialogDescription>
            Provide a location name and its coordinates to find nearby attractions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="locationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Paris, France" {...field} />
                  </FormControl>
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
