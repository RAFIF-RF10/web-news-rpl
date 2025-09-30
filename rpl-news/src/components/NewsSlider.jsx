import React, { useEffect, useState } from 'react'
import { newsData } from '../pages/News';


const NewsSlider = () => {

    const gallery = [
        {
            'image': '/image/slider1.jpg',
        },
        {
            'image': '/image/slider2.jpg',
        }
    ]

  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
   <div className="w-full h-80 md:h-[400px] rounded-xl overflow-hidden shadow-xl relative">
      {newsData.map((item, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentNews ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 bg-black/50 w-full text-white p-4">
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsSlider