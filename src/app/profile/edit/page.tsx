"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";

type Me = {
  username: string;
  email: string;
  role: string;
  profileDetails?: { bio?: string; profileImageUrl?: string };
};

export default function EditProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (!res.ok) {
          setError("Failed to load profile");
          return;
        }
        setMe(await res.json());
      } catch {
        setError("Failed to load profile");
      }
    })();
  }, []);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    if (me) {
      setUsername(me.username || "");
      setBio(me.profileDetails?.bio || "");
      setProfileImageUrl(me.profileDetails?.profileImageUrl || "");
    }
  }, [me]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = {};
      const nextUsername = username.trim();
      if (nextUsername) payload.username = nextUsername;

      const pd: any = {};
      const nextBio = bio.trim();
      const nextAvatar = profileImageUrl.trim();
      if (nextBio) pd.bio = nextBio;
      if (nextAvatar) pd.profileImageUrl = nextAvatar; // omit empty to satisfy URL schema
      if (Object.keys(pd).length > 0) payload.profileDetails = pd;

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "Update failed");
      }
      const updated = await res.json();
      setMe(updated);
      alert("Profile updated");
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="max-w-3xl mx-auto px-4 py-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={24}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm min-h-[120px]"
            maxLength={500}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL</label>
          <Input
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            type="url"
          />

          <ProfileImageUploader onUpload={(url) => setProfileImageUrl(url)} />
          <p className="text-xs text-neutral-500 mt-1">
            Use a square image for best results.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <a href="/profile" className="px-3 py-2 text-sm rounded border">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
