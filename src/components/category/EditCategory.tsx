"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getCategoryById, updatedCategory } from "@/services/categoryServices";

const EditCategory = ({categoryId} : {categoryId: string}) => {

    useEffect(()=>{
        // fetch category by id and set form values
       const fetchCategory = async () => {
         const data = await getCategoryById(categoryId);
         setCategory({
           name: data.name || "",
           slug: data.slug || "",
           description: data.description || "",
         });
       };
       fetchCategory();
    },[categoryId])

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
    const res = await updatedCategory(categoryId, category)
    console.log(res);
    return res
   } catch (error) {
    console.log('Failed to update category', error);
   }
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
          Edit Category
        </Button>
      </form>
    </div>
  );
};

export default EditCategory;
