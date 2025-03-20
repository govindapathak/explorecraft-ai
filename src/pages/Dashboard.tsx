
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Redirect to the location permission page to start the flow
    navigate('/location');
  }, [isAuthenticated, navigate]);

  // Loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Setting up your experience...</h2>
        <p className="text-muted-foreground">You'll be redirected in a moment</p>
      </div>
    </div>
  );
};

export default Dashboard;
