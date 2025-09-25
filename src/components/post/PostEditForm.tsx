"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import ImageExtension from "@tiptap/extension-image";
import MenuBar from "./text-editor/menu-bar";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface PostFormData {
  title: string;
  content: string;
  thumbnail: string;
  summary: string;
  categoryIds: string[];
  tagIds: string[];
}

interface PostEditFormProps {
  initialData: PostFormData;
  categories: Category[];
  onSubmit: (data: PostFormData) => Promise<any>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PostEditForm: React.FC<PostEditFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PostFormData>(initialData);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize rich text editor
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
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-h-[500px] object-fit rounded-md my-2",
        },
      }),
    ],
    immediatelyRender: false,
    content: initialData.content,
    editorProps: {
      attributes: {
        class: "min-h-[200px] border rounded-md bg-slate-50 py-2 px-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Initialize selected categories
  useEffect(() => {
    const selected = categories.filter(cat => 
      formData.categoryIds.includes(cat._id)
    );
    setSelectedCategories(selected);
  }, [categories, formData.categoryIds]);

  // Update editor content when initialData changes
  useEffect(() => {
    if (editor && initialData.content !== editor.getHTML()) {
      editor.commands.setContent(initialData.content);
    }
  }, [editor, initialData.content]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryAdd = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category && !formData.categoryIds.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId]
      }));
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(id => id !== categoryId)
    }));
    setSelectedCategories(prev => 
      prev.filter(cat => cat._id !== categoryId)
    );
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, thumbnail: "Please select a valid image file" }));
        return;
      }
      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxBytes) {
        setErrors(prev => ({ ...prev, thumbnail: "Image must be 5MB or smaller" }));
        return;
      }
      setThumbnailFile(file);
      setErrors(prev => ({ ...prev, thumbnail: "" }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnail: previewUrl }));
    }
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return null;
    
    try {
      setUploading(true);
      const signRes = await fetch("/api/uploads/cover/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: thumbnailFile.name }),
      });
      if (!signRes.ok) throw new Error("Failed to get upload signature");
      const { cloudName, apiKey, timestamp, folder, signature } = await signRes.json();

      const formData = new FormData();
      formData.append("file", thumbnailFile);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("folder", folder);
      formData.append("signature", signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadRes = await fetch(uploadUrl, { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const data = await uploadRes.json();
      return data.secure_url;
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      setErrors(prev => ({ ...prev, thumbnail: "Image upload failed. Please try again." }));
      return null;
    } finally {
      setUploading(false);
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    if (formData.thumbnail && !thumbnailFile && !isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = "Please enter a valid URL or upload an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let finalFormData = { ...formData };
      
      // Upload thumbnail if a file was selected
      if (thumbnailFile) {
        const uploadedUrl = await uploadThumbnail();
        if (uploadedUrl) {
          finalFormData.thumbnail = uploadedUrl;
        } else {
          return; // Upload failed, don't submit
        }
      }
      
      await onSubmit(finalFormData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const availableCategories = categories.filter(
    cat => !formData.categoryIds.includes(cat._id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter post title"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <div className="space-y-3">
          {/* File Upload */}
          <div className="flex items-center gap-2">
            <Input
              id="thumbnail-file"
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
              className="flex-1"
            />
            <div className="flex items-center text-sm text-gray-500">
              <Image className="h-4 w-4 mr-1" />
              Max 5MB
            </div>
          </div>
          
          {/* URL Input as fallback */}
          <div className="relative">
            <Input
              id="thumbnail"
              name="thumbnail"
              value={thumbnailFile ? '' : formData.thumbnail}
              onChange={handleInputChange}
              placeholder="Or paste image URL"
              className={errors.thumbnail ? "border-red-500" : ""}
              disabled={!!thumbnailFile}
            />
            {thumbnailFile && (
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setThumbnailFile(null);
                    setFormData(prev => ({ ...prev, thumbnail: '' }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {errors.thumbnail && (
          <p className="text-sm text-red-500">{errors.thumbnail}</p>
        )}
        
        {/* Preview */}
        {formData.thumbnail && (
          <div className="mt-2">
            <img
              src={formData.thumbnail}
              alt="Thumbnail preview"
              className="w-32 h-20 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {thumbnailFile && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {thumbnailFile.name}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCategories.map((category) => (
            <Badge key={category._id} variant="secondary" className="flex items-center gap-1">
              {category.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleCategoryRemove(category._id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        {availableCategories.length > 0 && (
          <Select onValueChange={handleCategoryAdd}>
            <SelectTrigger className={`w-full ${errors.categories ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Add a category" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.categories && (
          <p className="text-sm text-red-500">{errors.categories}</p>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          placeholder="Brief description of the post"
          rows={3}
        />
      </div>

      {/* Content - Rich Text Editor */}
      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <div className={`border rounded-md ${errors.content ? "border-red-500" : "border-gray-300"}`}>
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
        <p className="text-xs text-gray-500">
          Use the toolbar above to format your content with headings, bold, italic, lists, and more.
        </p>
      </div>


      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button 
          type="submit" 
          disabled={isLoading || uploading}
          className="min-w-24"
        >
          {uploading ? "Uploading..." : isLoading ? "Updating..." : "Update Post"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PostEditForm;
