import type { AuthUser } from "../contexts/AuthContext";

interface UserAvatarProps {
  user: Pick<AuthUser, "avatar" | "photoUrl"> | null | undefined;
  size?: number;
  radius?: number | string;
  className?: string;
}

export function UserAvatar({ user, size = 40, radius = "0.75rem", className = "" }: UserAvatarProps) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    flexShrink: 0,
  };

  if (user?.photoUrl) {
    return (
      <div style={style} className={`overflow-hidden ${className}`}>
        <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div style={style} className={`bg-primary flex items-center justify-center ${className}`}>
      <span
        className="text-primary-foreground select-none"
        style={{ fontWeight: 700, fontSize: Math.max(9, Math.round(size * 0.3)) }}
      >
        {user?.avatar ?? "?"}
      </span>
    </div>
  );
}

// Compress an image File to a base64 JPEG, max 240×240, quality 0.78
export function compressAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 240;
      let { width, height } = img;
      if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
      else { width = Math.round((width / height) * MAX); height = MAX; }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}
