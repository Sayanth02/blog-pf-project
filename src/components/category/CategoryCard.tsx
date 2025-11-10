import React from "react";

interface Category {
  _id: string;
  name: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="w-[210px] p-6 rounded-xl border flex items-center justify-center bg-white">
      <p className="text-lg font-semibold text-gray-700">{category.name}</p>
    </div>
  );
};

export default CategoryCard;
