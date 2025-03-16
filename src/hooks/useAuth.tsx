
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Handle login with different providers
  const login = async (
    provider: 'google' | 'apple' | 'facebook' | 'email',
    credentials?: { email: string; password: string }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock different auth providers
      let userData: AuthUser;
      
      switch (provider) {
        case 'google':
          userData = {
            id: 'google-123',
            name: 'Google User',
            email: 'user@gmail.com',
            photoUrl: 'https://lh3.googleusercontent.com/a/google-profile-image',
            provider: 'google'
          };
          break;
        case 'apple':
          userData = {
            id: 'apple-123',
            name: 'Apple User',
            email: 'user@icloud.com',
            provider: 'apple'
          };
          break;
        case 'facebook':
          userData = {
            id: 'facebook-123',
            name: 'Facebook User',
            email: 'user@facebook.com',
            photoUrl: 'https://graph.facebook.com/profile-image',
            provider: 'facebook'
          };
          break;
        case 'email':
          if (!credentials) {
            throw new Error('Email and password are required');
          }
          userData = {
            id: 'email-123',
            name: 'Email User',
            email: credentials.email,
            provider: 'email'
          };
          break;
        default:
          throw new Error('Invalid auth provider');
      }
      
      // Save to local storage and state
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
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
      // Simulate logout API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
