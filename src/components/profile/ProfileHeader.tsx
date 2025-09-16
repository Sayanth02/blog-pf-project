import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileHeader({
  username,
  role,
  profileImageUrl,
}: {
  username: string;
  role: string;
  profileImageUrl?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        {profileImageUrl ? (
          <AvatarImage src={profileImageUrl} alt={username} />
        ) : (
          <AvatarFallback className="bg-blue-500 text-white text-xl">
            {username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <h1 className="text-xl font-semibold">{username}</h1>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}
