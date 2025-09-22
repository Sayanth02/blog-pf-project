import { headers } from "next/headers";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default async function ProfilePage() {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const protocol =
    hdrs.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  const cookie = hdrs.get("cookie");

  const res = await fetch(`${protocol}://${host}/api/users/me`, {
    cache: "no-store",
    headers: {
      ...(cookie && { cookie }),
    },
  });
  if (res.status === 401) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        Please sign in to view your profile.
      </div>
    );
  }
  if (!res.ok) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        Failed to load profile.
      </div>
    );
  }
  const me = await res.json();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 space-y-8">
      <ProfileHeader
        username={me.username}
        role={me.role}
        profileImageUrl={me?.profileDetails?.profileImageUrl}
      />

      <div>
        <h2 className="text-sm font-semibold text-neutral-600">About</h2>
        <p className="mt-2 text-sm text-neutral-800 whitespace-pre-wrap">
          {me?.profileDetails?.bio || "No bio yet."}
        </p>
      </div>

      <div className="flex gap-3">
        <a href="/profile/edit" className="px-3 py-2 text-sm rounded border">
          Edit Profile
        </a>
        <a href="/profile/posts" className="px-3 py-2 text-sm rounded border">
          My Posts
        </a>
        <a href="/bookmarks" className="px-3 py-2 text-sm rounded border">
          Bookmarks
        </a>
      </div>
    </div>
  );
}
