
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Facebook, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

const LoginContent = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      await login(provider);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the useAuth hook
      console.error(error);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login('email', { email, password });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the useAuth hook
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your personalized travel recommendations
            </p>
          </div>
          
          <div className="bg-card border rounded-xl shadow-sm p-6">
            {!showEmailForm ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-foreground font-normal bg-background"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3" aria-hidden="true">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-foreground font-normal bg-background"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                >
                  <Apple className="h-5 w-5 mr-3" />
                  Continue with Apple
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-foreground font-normal bg-background"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                >
                  <Facebook className="h-5 w-5 mr-3 text-blue-600" />
                  Continue with Facebook
                </Button>
                
                <div className="relative my-6">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  Continue with Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setShowEmailForm(false)}
                  >
                    Back to all sign in options
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => (
  <AuthProvider>
    <LoginContent />
  </AuthProvider>
);

export default Login;
