import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'scale-in' | 'flip' | 'bounce' | 'zoom';
  delay?: number;
  className?: string;
  threshold?: number;
  duration?: number;
}

export const AnimatedSection = ({
  children,
  animation = 'fade',
  delay = 0,
  className = '',
  threshold = 0.1,
  duration = 700,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const animations = {
    fade: {
      initial: 'opacity-0',
      animate: 'opacity-100',
    },
    'slide-up': {
      initial: 'opacity-0 translate-y-16',
      animate: 'opacity-100 translate-y-0',
    },
    'slide-down': {
      initial: 'opacity-0 -translate-y-16',
      animate: 'opacity-100 translate-y-0',
    },
    'slide-left': {
      initial: 'opacity-0 -translate-x-16',
      animate: 'opacity-100 translate-x-0',
    },
    'slide-right': {
      initial: 'opacity-0 translate-x-16',
      animate: 'opacity-100 translate-x-0',
    },
    scale: {
      initial: 'opacity-0 scale-95',
      animate: 'opacity-100 scale-100',
    },
    'scale-in': {
      initial: 'opacity-0 scale-50',
      animate: 'opacity-100 scale-100',
    },
    flip: {
      initial: 'opacity-0 rotate-12 scale-90',
      animate: 'opacity-100 rotate-0 scale-100',
    },
    bounce: {
      initial: 'opacity-0 -translate-y-16',
      animate: 'opacity-100 translate-y-0 animate-bounce-subtle',
    },
    zoom: {
      initial: 'opacity-0 scale-110 blur-sm',
      animate: 'opacity-100 scale-100 blur-0',
    },
  };

  const selected = animations[animation];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isVisible ? selected.animate : selected.initial
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
};
