
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface AnimatedTransitionProps {
  children: React.ReactNode;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname && containerRef.current) {
      // Route has changed, trigger animation
      containerRef.current.classList.remove('animate-fade-in');
      containerRef.current.classList.add('animate-fade-out');
      
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove('animate-fade-out');
          containerRef.current.classList.add('animate-fade-in');
          prevPathRef.current = location.pathname;
        }
      }, 150);
    }
  }, [location.pathname]);

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen animate-fade-in transition-all duration-300 ease-in-out"
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
