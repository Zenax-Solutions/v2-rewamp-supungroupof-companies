import { Building2, ImageIcon } from "lucide-react";
import { getFileUrl } from "@/services/api";

interface ImagePlaceholderProps {
  companyName?: string;
  industry?: string;
  className?: string;
  showIcon?: boolean;
}

export const ImagePlaceholder = ({
  companyName = "Company",
  industry,
  className = "h-48",
  showIcon = true,
}: ImagePlaceholderProps) => {
  return (
    <div
      className={`${className} bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex flex-col items-center justify-center p-6`}
    >
      {showIcon && (
        <div className="mb-2">
          <Building2 className="text-primary/30" size={48} />
        </div>
      )}
      <p className="text-sm text-muted-foreground text-center font-medium">
        {companyName}
      </p>
      {industry && (
        <p className="text-xs text-muted-foreground/70 text-center mt-1">
          {industry}
        </p>
      )}
    </div>
  );
};

interface CompanyImageProps {
  imageUrl: string | undefined;
  companyName: string;
  industry?: string;
  className?: string;
  alt?: string;
}

export const CompanyImage = ({
  imageUrl,
  companyName,
  industry,
  className = "h-48",
  alt,
}: CompanyImageProps) => {
  const fullImageUrl = getFileUrl(imageUrl);

  if (!fullImageUrl) {
    return (
      <ImagePlaceholder
        companyName={companyName}
        industry={industry}
        className={className}
      />
    );
  }

  return (
    <div className={`${className} overflow-hidden bg-gray-100 relative`}>
      <img
        src={fullImageUrl}
        alt={alt || companyName}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Replace with placeholder on error
          const parent = e.currentTarget.parentElement;
          if (parent) {
            e.currentTarget.style.display = "none";
            const placeholder = document.createElement("div");
            placeholder.className = `absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex flex-col items-center justify-center p-6`;
            placeholder.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/30 mb-2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <p class="text-sm text-muted-foreground text-center font-medium">${companyName}</p>
            `;
            parent.appendChild(placeholder);
          }
        }}
      />
    </div>
  );
};
