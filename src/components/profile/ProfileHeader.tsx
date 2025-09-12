"use client";
import React from "react";

type ProfileHeaderProps = {
  username: string;
  role: string;
  profileImageUrl?: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  role,
  profileImageUrl,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center">
        {profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileImageUrl}
            alt={username}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-neutral-500 text-sm">No Image</span>
        )}
      </div>
      <div>
        <div className="text-lg font-semibold">{username}</div>
        <div className="text-xs inline-block px-2 py-0.5 rounded border border-neutral-300 text-neutral-600">
          {role}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
