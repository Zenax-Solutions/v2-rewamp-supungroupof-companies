import { useScrollProgress } from '@/hooks/use-scroll-animation';

export const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(217, 119, 6, 0.5)',
        }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
};
