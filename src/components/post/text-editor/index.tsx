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


interface TextEditorProps {
  initialContent?: string;
  onSubmit: (post: {
    title: string;
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
  const [thumbnail, setThumbnail] = useState("");
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
  const handleSubmit = () => {
    onSubmit({
      title,
      thumbnail,
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

      {/* Thumbnail URL */}
      <Input
        type="text"
        placeholder="Thumbnail Image URL"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        className="max-w-2xl"
      />
      {/* Category Select */}
      <CategorySelect value={category} onChange={setCategory} />

      {/* Rich Text Editor */}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      {/* Submit */}
      <Button className="my-4" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
