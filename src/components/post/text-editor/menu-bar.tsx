"use client";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Trash2,
} from "lucide-react";
import { Toggle } from "../../ui/toggle";
import { Editor } from "@tiptap/react";
import { useMemo, useRef, useCallback } from "react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onToggleHeading1 = useCallback(
    () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    [editor]
  );
  const onToggleHeading2 = useCallback(
    () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    [editor]
  );
  const onToggleHeading3 = useCallback(
    () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    [editor]
  );
  const onToggleBold = useCallback(
    () => editor.chain().focus().toggleBold().run(),
    [editor]
  );
  const onToggleItalic = useCallback(
    () => editor.chain().focus().toggleItalic().run(),
    [editor]
  );
  const onToggleStrike = useCallback(
    () => editor.chain().focus().toggleStrike().run(),
    [editor]
  );
  const onAlignLeft = useCallback(
    () => editor.chain().focus().setTextAlign("left").run(),
    [editor]
  );
  const onAlignCenter = useCallback(
    () => editor.chain().focus().setTextAlign("center").run(),
    [editor]
  );
  const onAlignRight = useCallback(
    () => editor.chain().focus().setTextAlign("right").run(),
    [editor]
  );
  const onBulletList = useCallback(
    () => editor.chain().focus().toggleBulletList().run(),
    [editor]
  );
  const onOrderedList = useCallback(
    () => editor.chain().focus().toggleOrderedList().run(),
    [editor]
  );
  const onHighlight = useCallback(
    () => editor.chain().focus().toggleHighlight().run(),
    [editor]
  );
  const onDelete = useCallback(
    () => editor.chain().focus().deleteSelection().run(),
    [editor]
  );

  const Options = useMemo(
    () => [
      {
        icon: <Heading1 className="size-4" />,
        onClick: onToggleHeading1,
        preesed: editor.isActive("heading", { level: 1 }),
      },
      {
        icon: <Heading2 className="size-4" />,
        onClick: onToggleHeading2,
        preesed: editor.isActive("heading", { level: 2 }),
      },
      {
        icon: <Heading3 className="size-4" />,
        onClick: onToggleHeading3,
        preesed: editor.isActive("heading", { level: 3 }),
      },
      {
        icon: <Bold className="size-4" />,
        onClick: onToggleBold,
        preesed: editor.isActive("bold"),
      },
      {
        icon: <Italic className="size-4" />,
        onClick: onToggleItalic,
        preesed: editor.isActive("italic"),
      },
      {
        icon: <Strikethrough className="size-4" />,
        onClick: onToggleStrike,
        preesed: editor.isActive("strike"),
      },
      {
        icon: <AlignLeft className="size-4" />,
        onClick: onAlignLeft,
        preesed: editor.isActive({ textAlign: "left" }),
      },
      {
        icon: <AlignCenter className="size-4" />,
        onClick: onAlignCenter,
        preesed: editor.isActive({ textAlign: "center" }),
      },
      {
        icon: <AlignRight className="size-4" />,
        onClick: onAlignRight,
        preesed: editor.isActive({ textAlign: "right" }),
      },
      {
        icon: <List className="size-4" />,
        onClick: onBulletList,
        preesed: editor.isActive("bulletList"),
      },
      {
        icon: <ListOrdered className="size-4" />,
        onClick: onOrderedList,
        preesed: editor.isActive("orderedList"),
      },
      {
        icon: <Highlighter className="size-4" />,
        onClick: onHighlight,
        preesed: editor.isActive("highlight"),
      },
      {
        icon: <ImageIcon className="size-4" />,
        onClick: () => fileInputRef.current?.click(),
        preesed: false,
      },
      {
        icon: <Trash2 className="size-4" />,
        onClick: onDelete,
        preesed: false,
      },
    ],
    [
      editor,
      onToggleHeading1,
      onToggleHeading2,
      onToggleHeading3,
      onToggleBold,
      onToggleItalic,
      onToggleStrike,
      onAlignLeft,
      onAlignCenter,
      onAlignRight,
      onBulletList,
      onOrderedList,
      onHighlight,
      onDelete,
    ]
  );

  // Handle file selection → insert image into editor
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };
    reader.readAsDataURL(file); // Convert to base64
  };

  return (
    <div className="sticky top-0 border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50 flex flex-wrap">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}

      {/* hidden input for file picker */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
