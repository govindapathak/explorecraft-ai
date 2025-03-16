
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Map, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observeElements = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-scale-in', 'opacity-100');
              entry.target.classList.remove('opacity-0', 'translate-y-8');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '-10% 0px' }
      );

      if (heroRef.current) {
        observer.observe(heroRef.current);
      }

      featureRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return observer;
    };

    const observer = observeElements();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div 
          ref={heroRef}
          className="container mx-auto max-w-6xl flex flex-col items-center text-center transition-all duration-700 transform opacity-0 translate-y-8"
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Lightbulb className="h-4 w-4 mr-2" />
            AI-Powered Travel Itineraries
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
            Plan your perfect trip in seconds with AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Discover the best places, activities, and restaurants tailored to your preferences - all with a few taps.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/login">
              <Button size="lg" className="rounded-full text-base px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="rounded-full text-base px-8">
                Explore Features
              </Button>
            </Link>
          </div>
          
          <div className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200" 
              alt="Travel planning with ExploreAI" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 backdrop-blur-lg p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Vancouver</div>
                    <div className="text-white/80 text-sm">Weekend Getaway</div>
                  </div>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  View Itinerary
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plan your trip in three simple steps without the hassle of traditional trip planning.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="h-10 w-10 text-primary" />,
                title: "Select Your Location",
                description: "Choose your destination or use your current location to get started."
              },
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Set Your Preferences",
                description: "Tell us what matters - accessibility, ratings, weather protection, and more."
              },
              {
                icon: <Map className="h-10 w-10 text-primary" />,
                title: "Get Your Itinerary",
                description: "Receive AI-powered recommendations and build your perfect itinerary."
              }
            ].map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureRefs.current[index] = el)}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-700 transform opacity-0 translate-y-8",
                  index === 0 ? "delay-[200ms]" : index === 1 ? "delay-[400ms]" : "delay-[600ms]"
                )}
              >
                <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start exploring?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create your first AI-powered itinerary today and discover the perfect places to visit.
            </p>
            <Link to="/login">
              <Button size="lg" className="rounded-full text-base px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <MapPin className="text-primary w-5 h-5 mr-2" />
              <span className="font-semibold">ExploreAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ExploreAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
