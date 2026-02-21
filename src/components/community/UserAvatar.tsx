import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  displayName: string | null;
  avatarUrl: string | null;
  className?: string;
}

export function UserAvatar({ displayName, avatarUrl, className }: UserAvatarProps) {
  const initials = (displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || "User"} />}
      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
