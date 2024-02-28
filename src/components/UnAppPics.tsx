"use client"
import React, { useEffect, useState } from "react"
import Picture from "./UnAppPic"
import { supabase } from "../utils/Utils"


export default function AwaitAppPics(){
    const [togOn, setTogOn] = useState(false)
    const [images, setImages] = useState([]);

    //toggler function
    const toggler = () => {
        setTogOn(!togOn)
    }

    useEffect(() => {
        async function fetchImageUrls() {
          try {
            // Fetch the URLs from Supabase based on parameters
            const { data, error } = await supabase
              .from('eventPhotos')
              .select()
              .eq('photoStatus', 'rejected')
    
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
        <div className="mt-12">
            <div className=" mb-4 ">
                <p className="text-xl font-medium">Rejected Photos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">  
                   {images.length > 0 ? (
                            images.map((image, index) => (
                                <Picture key={index} id={image.id} url={image.photoUrl} />
                            ))
                      ) : (
                          <p className="text-gray-500">No Pictures Available</p>
                    )}
            </div>
        </div> 
    )
    
   
}