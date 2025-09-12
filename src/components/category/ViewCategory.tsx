"use client";
import { deleteCategory, getAllCategories } from '@/services/categoryServices';
import { PenIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Category = {
  _id: string;
  name: string;
  description: string;
  slug: string;
};

const ViewCategory = () => {
    const [categories,setCategories] = useState<Category[]>([])
    const router = useRouter();
    useEffect(()=>{
        const fetchCategories = async()=>{
            const data = await getAllCategories();
            setCategories(data);
            console.log(data);
            
        }
        fetchCategories();
    },[])

    const handleEdit = (_id:string) =>{
       router.push(`/category/edit-category/${_id}`)
    }

   const handleDelete = async (_id: string) => {
     if (!confirm("Are you sure?")) return;
     await deleteCategory(_id);
     const updatedList = await getAllCategories();
     setCategories(updatedList);
   };
  return (
    <>
      {categories.map((cat) => (
        <div key={cat._id} className="p-4 border-b">
          <h2 className="text-xl font-semibold">{cat.name}</h2>
          <p className="text-gray-600">{cat.description}</p>
          <p className="text-sm text-gray-500">Slug: {cat.slug}</p>

          <div className="flex justify-between">
            <button onClick={() => handleEdit(cat._id)}>
              <PenIcon />
            </button>
            <button onClick={() => handleDelete(cat._id)}>
              <Trash />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ViewCategory