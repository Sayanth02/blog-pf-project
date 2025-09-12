'use client'
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createTag } from "@/services/tagServices";

const AddTag = () => {
  const [tag, setTag] = useState({ name: "", slug: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag({ ...tag, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createTag(tag);
      console.log("Tag created successfully", res);
      setTag({ name: "", slug: "" }); // Reset form if needed
      // Optionally trigger UI update or toast notification
    } catch (error) {
      console.error("Failed to add tag", error);
    }
  };
   return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-w-md mx-auto">
       <h1 className="m-4 text-2xl text-center font-semibold">Add New Tag</h1>
      <Input
        type="text"
        name="name"
        placeholder="Tag name"
        value={tag.name}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="slug"
        placeholder="Slug"
        value={tag.slug}
        onChange={handleChange}
      />
      <Button type="submit" className="w-full mt-4">
        Add Tag
      </Button>
    </form>
  );
};

export default AddTag;
