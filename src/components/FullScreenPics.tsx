"use client"
import React, { useEffect, useState } from "react"
import FullScreenPic from "./FullScreenPic"
import { supabase } from "../utils/Utils"


export default function ApprovedPics(){
    const [images, setImages] = useState <any>([]);

    useEffect(() => {
        async function fetchImageUrls() {
          try {
            // Fetch the URLs from Supabase based on parameters
            const { data, error } = await supabase
              .from('eventPhotos')
              .select()
              .eq('photoStatus', 'approved')
    
            if (error) {
              throw error;
            }
    
            if (data) {
              setImages(data)
            }

          } catch (error) {

          }
        }
    
        fetchImageUrls();
      }, []);
    return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-0 ">
                      {images.length > 0 ? (
                            images.map((image, index) => (
                                <FullScreenPic key={index} url={image.photoUrl} />
                            ))
                        ) : (
                            <p className="text-gray-500">Picture Loading...</p>
                        )}
                </div>
        )
}