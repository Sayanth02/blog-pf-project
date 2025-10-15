"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "../../ui/button";
import Image from "@tiptap/extension-image";
import { Input } from "../../ui/input";
import CategorySelect from "./CategorySelect";
import { Textarea } from "@/components/ui/textarea";


interface TextEditorProps {
  initialContent?: string;
  onSubmit: (post: {
    title: string;
    summary: string;
    thumbnail: string;
    content: string;
    categoryIds: string[];
  }) => void;
}
export default function TextEditor({
  initialContent = "",
  onSubmit,
}: TextEditorProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: " max-h-[500px] object-fit rounded-md my-2",
        },
      }),
    ],
    immediatelyRender: false,
    content: initialContent,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });
  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    let thumbnailUrl = thumbnail;

    // If a file is selected, upload it to Cloudinary first
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxBytes) {
        setError("Image must be 5MB or smaller");
        return;
      }

      try {
        setUploading(true);
        const signRes = await fetch("/api/uploads/cover/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name }),
        });
        if (!signRes.ok) throw new Error("Failed to get upload signature");
        const { cloudName, apiKey, timestamp, folder, signature } =
          await signRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("folder", folder);
        formData.append("signature", signature);


        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const uploadRes = await fetch(uploadUrl, { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const data = await uploadRes.json();
        thumbnailUrl = data.secure_url;
        setThumbnail(thumbnailUrl);
      } catch (e) {
        setError("Image upload failed. Please try again.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit({
      title,
      summary,
      thumbnail: thumbnailUrl,
      content,
      categoryIds: category ? [category] : [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Post Title */}
      <Input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="max-w-2xl"
      />
      {/* summary */}
     
        <Textarea
          id="summary"
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief description of the post"
          rows={3}
        />
      {/* Thumbnail picker */}
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="max-w-2xl"
        />
        <Input
          type="text"
          placeholder="Or paste image URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="max-w-2xl"
        />
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt="Thumbnail preview"
            className="h-32 rounded border"
          />
        )}
      </div>
      {/* Category Select */}
      <CategorySelect value={category} onChange={setCategory} />

      {/* Rich Text Editor */}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      {/* Submit */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="my-4" onClick={handleSubmit} disabled={uploading}>
        {uploading ? "Uploading..." : "Submit"}
      </Button>
    </div>
  );
}
