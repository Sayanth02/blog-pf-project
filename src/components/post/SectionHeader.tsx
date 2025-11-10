import React from 'react'
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  link: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, link }) => {
  return (
    <div className="w-full border border-neutral-300 rounded-3xl p-8 mb-4 flex flex-col md:flex-row justify-between">
      <h2 className="font-semibold ">{title}</h2>
      <Link className="font-bold flex gap-2 item-center" href={`/${link}`}>
        <span className="text-lg font-bold underline">Discover more</span>{" "}
        <CircleArrowRight />
      </Link>
    </div>
  );
};

export default SectionHeader