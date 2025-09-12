"use client"
import EditCategory from '@/components/category/EditCategory';
import React from 'react'

const page = ({ params }: { params: { categoryId: string } }) => {
  const { categoryId } = params;
  return <div>
    <EditCategory categoryId={categoryId}/>
  </div>;
};

export default page