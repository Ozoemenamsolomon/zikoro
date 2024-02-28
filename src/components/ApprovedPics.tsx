"use client"
import React, { useEffect, useState } from "react"
import Picture from "./ApprvPic"
import { supabase } from "../utils/Utils"
import {toast } from 'react-toastify';


export default function ApprovedPics(){
    const [images, setImages] = useState([]);
    const [id, setId] = useState([]);
    

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
              setImages(data)

          } catch (error) {

          }
        }
    
        fetchImageUrls();
      }, []);
    return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                      {images.length > 0 ? (
                            images.map((image, index) => (
                                <Picture key={index} id={image.id} url={image.photoUrl} like={image.likes} />
                            ))
                        ) : (
                            <p className="text-gray-500">No Pictures Available</p>
                        )}
                </div>
        )
}