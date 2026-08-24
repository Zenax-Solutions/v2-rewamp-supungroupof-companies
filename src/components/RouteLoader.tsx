import { Loader2 } from "lucide-react";

export const RouteLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo/spinner */}
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <div className="absolute inset-0 animate-ping opacity-20">
            <Loader2 className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-muted-foreground">
            Loading
          </span>
          <span className="flex gap-1">
            <span className="animate-bounce delay-0">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-progress-bar" />
        </div>
      </div>
    </div>
  );
};
