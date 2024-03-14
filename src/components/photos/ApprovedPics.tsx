"use client"
import React, { useEffect, useState } from "react"
import Picture from "./ApprvPic"


type DBEventPhoto = {
  id : number,
  created_at : string,
  "eventId" : number,
  "eventName" : string,
  "userId" : number,
  "userEmail" : string,
  "photoStatus" : string,
  likes : number,
  photoUrl : string
// "likeUsers" json null,
// "Reports" numeric null,
// "ReportsUsers" json null,
// photo text null,
}


export default function ApprovedPics(){
    const [images, setImages] = useState<DBEventPhoto[]|undefined>(undefined);

    useEffect(() => {
        async function fetchImageUrls() {

          fetch('/api/fetchImages/fetchApprovedImages', {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                      {images?.length ? (
                            images?.map((image, index) => (
                                <Picture key={index} id={image.id} url={image.photoUrl} like={image.likes} />
                            ))
                        ) : (
                            <p className="text-gray-500">No Pictures Available</p>
                        )}
                </div>
        )
}