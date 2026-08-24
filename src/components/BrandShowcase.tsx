import { useEffect, useRef, useState } from 'react';
import { getFileUrl } from '@/services/api';

interface BrandShowcaseProps {
  brands: Array<{
    id: number;
    name: string;
    logoUrl: string;
    website?: string;
  }>;
}

export const BrandShowcase = ({ brands }: BrandShowcaseProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden py-8">
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-12 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          scrollBehavior: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedBrands.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="flex-shrink-0 w-48 md:w-64 h-32 md:h-40 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            {brand.website ? (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full flex items-center justify-center"
                title={brand.name}
              >
                <img
                  src={getFileUrl(brand.logoUrl) || ''}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain filter brightness-100"
                  loading="lazy"
                />
              </a>
            ) : (
              <img
                src={getFileUrl(brand.logoUrl) || ''}
                alt={brand.name}
                className="max-w-full max-h-full object-contain filter brightness-100"
                loading="lazy"
                title={brand.name}
              />
            )}
          </div>
        ))}
      </div>
      
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
