"use client"
import React, { useEffect, useState } from "react"
import Picture from "./UnAppPic"

type UnAppPicsProps = {
  url: string,
  id: number,
  photoUrl: string
}

export default function AwaitAppPics(){
    const [togOn, setTogOn] = useState(false)
    const [images, setImages] = useState<UnAppPicsProps[]|undefined>(undefined);

    //toggler function
    const toggler = () => {
        setTogOn(!togOn)
    }

    useEffect(() => {
        async function fetchImageUrls() {
            fetch('/api/fetchImages/fetchUnapprovedImages', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                  // You might need additional headers like authorization if required
                }
              })
                .then(response => response.json())
                .then(data => setImages(data.data))
                .catch(
                  error => console.error('Error:', error)
                );
        }
    
        fetchImageUrls();
      }, []);

    return (
        <div className="mt-12">
            <div className=" mb-4 ">
                <p className="text-xl font-medium">Rejected Photos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">  
                   {images?.length ? (
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