import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from '@/services/categoryServices';

interface Category {
  _id: string;
  name: string;
}
interface CategorySelectProps {
  value: string | null; 
  onChange: (id: string) => void;
}


const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
     const [categories, setCategories] = useState<Category[]>([]);
     useEffect(()=>{
     const fetchCategories = async ()=>{
     try {
     const res = await getAllCategories()
     console.log(res);
     
     setCategories(res)
     } catch (error) {
        console.error("Failed to fetch categories", error);
     }
     }
     fetchCategories()
     },[])
  return (
    <div>
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger className="w-[672px]">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CategorySelect