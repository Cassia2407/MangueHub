import logoSrc from "../../assets/falamangue-logo-square.webp";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-7 w-7 rounded-lg",
  md: "h-8 w-8 rounded-xl",
  lg: "h-9 w-9 rounded-xl",
};

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`${sizeClasses[size]} inline-flex shrink-0 overflow-hidden bg-black ring-1 ring-black/10 shadow-sm ${className}`}
    >
      <img src={logoSrc} alt="" className="h-full w-full object-cover" />
    </span>
  );
}
