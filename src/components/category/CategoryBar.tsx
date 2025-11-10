"use client";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "@/services/categoryServices";
import CategoryCard from "./CategoryCard";
import SsectionHeader from "@/components/post/SectionHeader";

interface Category {
  _id: string;
  name: string;
}

const CategoryBar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories([
      { _id: "1", name: "Technology" },
      { _id: "2", name: "Health" },
      { _id: "3", name: "Travel" },
      { _id: "4", name: "Food" },
      { _id: "3", name: "Travel" },
      { _id: "4", name: "Food" },
    ]);
  }, []);

  return (
    <div className="p-8">
      {/* <SsectionHeader title="Categories" link="categories" /> */}
      <div className="w-full flex flex-wrap gap-6 justify-center  mt-6 ">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
