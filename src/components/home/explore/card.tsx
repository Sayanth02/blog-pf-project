import { link } from 'fs';
import React from 'react'
import {
  FaArrowTrendUp,
  FaMagnifyingGlassChart,
} from "react-icons/fa6";
import { PiIntersect } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";


const Card = () => {
    const ExploreItems = [
      {
        icon: <FaArrowTrendUp />,
        title: "Discover Trending Topics and Insigts from Our Authors",
        description: "Dive into a Variety of categories tailored to your intrests.",
        link: "/posts/trending",
      },
      {
        icon: <FaMagnifyingGlassChart />,
        title: "Stay Updated with the Latest in technology and innovation",
        description: "Get insights on the newest trends in tech.",
        link: "/posts/latest",
      },
      {
        icon: <PiIntersect />,
        title: "Join Our Community of Passionate writers and Authors",
        description: "Connect with like-minded individuals and share your thoughts.",
        link: "/authors/top",
      },
    ];
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-4 p-4  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {ExploreItems.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-3 p-8 ">
          <span className="text-xl">{item.icon}</span>
          <div className="text-center">
            <h2 className="font-extralight text-2xl">{item.title}</h2>
            <p className="text-sm text-gray-500 mt-4 tracking-wider">
              {item.description}
            </p>
          </div>
          <button className='flex gap-2 items-center'>
            Learn More <IoIosArrowForward />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Card