import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define auth types for Google, Apple, and Facebook
interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  provider: 'google' | 'apple' | 'facebook' | 'email';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (provider: 'google' | 'apple' | 'facebook' | 'email', credentials?: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google client ID - replace with your own from Google Cloud Console
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

// Type definition for Google's auth response
interface GoogleAuthResponse {
  clientId: string;
  credential: string;
  select_by: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load the Google Identity Services script
  useEffect(() => {
    const loadGoogleScript = () => {
      // Skip if already loaded
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        setGoogleLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity Services script loaded');
        setGoogleLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Error loading Google script:', error);
        setError('Failed to load Google authentication');
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleScript();
  }, []);

  // Check for existing auth on mount
  useEffect(() => {
    // Check local storage for saved user data
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing saved user data', e);
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Initialize Google Sign-In when the script is loaded
  useEffect(() => {
    if (!googleLoaded || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, [googleLoaded]);

  // Function to handle Google sign-in response
  const handleGoogleSignIn = async (response: GoogleAuthResponse) => {
    try {
      // Decode the JWT token to extract user information
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const { sub, email, name, picture } = JSON.parse(jsonPayload);

      // Create user object from Google data
      const userData: AuthUser = {
        id: sub,
        name: name,
        email: email,
        photoUrl: picture,
        provider: 'google',
      };

      // Save to local storage and state
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name}!`,
      });
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      setError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle login with different providers
  const login = async (
    provider: 'google' | 'apple' | 'facebook' | 'email',
    credentials?: { email: string; password: string }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch (provider) {
        case 'google':
          if (!googleLoaded || !window.google) {
            throw new Error('Google authentication is not available');
          }
          
          // Trigger Google sign-in popup
          window.google.accounts.id.prompt();
          
          // Note: The actual sign-in happens in the callback
          // so we don't set the user here
          break;
        case 'apple':
          // Mock Apple login for now
          await new Promise(resolve => setTimeout(resolve, 1000));
          const appleUser: AuthUser = {
            id: 'apple-123',
            name: 'Apple User',
            email: 'user@icloud.com',
            provider: 'apple'
          };
          localStorage.setItem('auth_user', JSON.stringify(appleUser));
          setUser(appleUser);
          
          toast({
            title: "Login successful",
            description: `Welcome, ${appleUser.name}!`,
          });
          break;
        case 'facebook':
          // Mock Facebook login for now
          await new Promise(resolve => setTimeout(resolve, 1000));
          const fbUser: AuthUser = {
            id: 'facebook-123',
            name: 'Facebook User',
            email: 'user@facebook.com',
            photoUrl: 'https://graph.facebook.com/profile-image',
            provider: 'facebook'
          };
          localStorage.setItem('auth_user', JSON.stringify(fbUser));
          setUser(fbUser);
          
          toast({
            title: "Login successful",
            description: `Welcome, ${fbUser.name}!`,
          });
          break;
        case 'email':
          if (!credentials) {
            throw new Error('Email and password are required');
          }
          // Mock email login for now
          await new Promise(resolve => setTimeout(resolve, 1000));
          const emailUser: AuthUser = {
            id: 'email-123',
            name: 'Email User',
            email: credentials.email,
            provider: 'email'
          };
          localStorage.setItem('auth_user', JSON.stringify(emailUser));
          setUser(emailUser);
          
          toast({
            title: "Login successful",
            description: `Welcome, ${emailUser.name}!`,
          });
          break;
        default:
          throw new Error('Invalid auth provider');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // For Google, we should also sign out from Google
      if (user?.provider === 'google' && window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      // Clear local storage and state
      localStorage.removeItem('auth_user');
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      
      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
