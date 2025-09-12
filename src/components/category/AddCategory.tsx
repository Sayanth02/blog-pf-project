"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createCategory } from "@/services/categoryServices";
import { toast } from "sonner";

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   try {
    const res = await createCategory(category)
     toast.success(`Category added`, {
       position: "top-center",
     });
    return res;
   } catch (error) {
    console.log('Failed to add category', error);
   }
    // console.log("Category submitted:", category);
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Input
          type="text"
          name="name"
          placeholder="Category name"
          value={category.name}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={category.description}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="slug"
          placeholder="Slug"
          value={category.slug}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full mt-4">
          Add Category
        </Button>
      </form>
    </div>
  );
};

export default AddCategory;
