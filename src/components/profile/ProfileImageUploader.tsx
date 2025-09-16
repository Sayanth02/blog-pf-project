'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileImageUploader({onUpload}: {onUpload: (url: string) => void}) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!file) return setError("Please select an image");

        try {
          setUploading(true);
          setError(null);

          const signRes = await fetch("/api/uploads/profile/sign", {
            method: "POST",
          });
          if (!signRes.ok) throw new Error("sign failed");
          const { cloudName, apiKey, timestamp, folder, signature } =
            await signRes.json();

          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", apiKey);
          formData.append("timestamp", String(timestamp));
          formData.append("folder", folder);
          formData.append("signature", signature);


          const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
          console.log("Uploading to:", uploadUrl, formData);
          const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error("upload failed");
          const data = await uploadRes.json();
          console.log("Upload response:", data);

          onUpload(data.secure_url);
        } catch (err) {
          setError("Upload failed");
        } finally {
          setUploading(false);
        }
    }
  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
