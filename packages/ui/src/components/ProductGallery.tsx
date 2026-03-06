"use client";

import { useState } from "react";
import Image from "next/image";

interface ImagesProps {
  images: string[];
}

export function ProductGallery ({images} : ImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-2">
      <div className="items-center self-center" >
        <Image
          alt={`${selectedImage} image`}
          src={selectedImage}
          width={300}
          height={300}    
          className="rounded-xl object-contain shadow-lg" 
          fetchPriority="high"
        />
      </div>
      <div className="grid grid-cols-6 gap-1" >
        {images.map((img, index) => {
          const isSelected = img === selectedImage;

          return (
            <Image  
              key={index}             
              alt={`product thumbnail ${index + 1}`}
              src={img}
              width={70}
              height={70}
              className={`rounded-md transition-all duration-300
              ${isSelected ? "ring-1 ring-green-500" : "hover:cursor-pointer"}`}
              onClick={() => setSelectedImage(img)}         
              fetchPriority="high"     
            />          
          )                   
        })}
      </div>
    </div>
  )
}