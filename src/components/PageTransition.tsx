import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start transition
    setIsLoaded(false);
    setIsTransitioning(true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Complete transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Loading overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Loader2 className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top progress bar */}
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-progress-bar">
          <div className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Page content (avoid transform on layout wrapper so position:fixed/sticky works) */}
      <div
        className={`transition-opacity duration-300 ease-out ${
          isLoaded
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </>
  );
};
