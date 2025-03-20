
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Handle login with email/password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Handle sign up with email/password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    toast({
      title: "Sign up successful",
      description: "Please check your email for confirmation",
    });
  } catch (error: any) {
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Handle logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  } catch (error: any) {
    toast({
      title: "Logout failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};
