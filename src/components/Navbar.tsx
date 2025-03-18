
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X, User, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-border/50 dark:bg-black/80' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <MapPin className="text-primary w-6 h-6" />
          <span className="font-semibold text-lg">ExploreAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!isHomePage && (
            <Link 
              to="/"
              className="transition-colors text-sm font-medium hover:text-primary flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          )}
          <Link 
            to="/dashboard" 
            className={cn(
              "transition-colors text-sm font-medium hover:text-primary",
              location.pathname === "/dashboard" ? "text-primary" : "text-foreground/80"
            )}
          >
            Discover
          </Link>
          <Link 
            to="/itinerary" 
            className={cn(
              "transition-colors text-sm font-medium hover:text-primary",
              location.pathname === "/itinerary" ? "text-primary" : "text-foreground/80"
            )}
          >
            My Itinerary
          </Link>
          {location.pathname === "/" || location.pathname === "/login" ? (
            <Link to="/login">
              <Button variant="default" size="sm" className="rounded-full shadow-button">
                Sign In
              </Button>
            </Link>
          ) : (
            <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/50 animate-slide-in-right">
          <div className="container py-4 px-4 flex flex-col space-y-4">
            {!isHomePage && (
              <Link 
                to="/" 
                className="py-2 px-4 rounded-lg transition-colors hover:bg-primary/5 flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            )}
            <Link 
              to="/dashboard" 
              className={cn(
                "py-2 px-4 rounded-lg transition-colors",
                location.pathname === "/dashboard" 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-primary/5"
              )}
            >
              Discover
            </Link>
            <Link 
              to="/itinerary" 
              className={cn(
                "py-2 px-4 rounded-lg transition-colors",
                location.pathname === "/itinerary" 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-primary/5"
              )}
            >
              My Itinerary
            </Link>
            {location.pathname === "/" || location.pathname === "/login" ? (
              <Link to="/login" className="w-full">
                <Button variant="default" className="w-full rounded-lg shadow-button">
                  Sign In
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">My Profile</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
