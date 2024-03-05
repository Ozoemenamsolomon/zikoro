"use client"
import React, { useEffect, useState } from "react"
import Picture from "./AwaitAppPic"
import {RiToggleFill} from "react-icons/ri"
import {RiToggleLine} from "react-icons/ri"
import { supabase } from "../utils/Utils"
import {toast } from 'react-toastify';

type AwaitAppPicsProps = {
  url: string,
  id: number,
  photoUrl: string
}


export default function AwaitAppPics(){
    const [togOn, setTogOn] = useState(false)
    const [images, setImages] = useState<AwaitAppPicsProps[]|undefined>(undefined);

    //toggler function
    const toggler = () => {
        setTogOn(!togOn)
    }

    const autoApprove = async () => {
      toggler()
      try {        
        // Update the parameters for the specified image
        const { error } = await supabase
          .from('eventPhotos')
          .update({"photoStatus": 'approved'})
          .eq('photoStatus', 'awaiting');
  
        if (error) {
          throw error;
        } toast.success('Pictures Auto-Approved');

      } catch (error) {
        toast.error(`Error Auto-Approving Pictures`);
      }
    }


    useEffect(() => {
        async function fetchImageUrls() {
          try {
            // Fetch the URLs from Supabase based on parameters
            const { data, error } = await supabase
              .from('eventPhotos')
              .select()
              .eq('photoStatus', 'awaiting')
    
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
                <div className="flex justify-between mb-4 ">
                    <p className="text-xl font-medium">Awaiting Approval</p>
                    <div className="flex font-medium space-x-2 items-center mr-4">
                    {
                        togOn ? <RiToggleFill className="text-3xl cursor-pointer" onClick={toggler} width={32} height={20} fill="#001FCC" /> : <RiToggleLine onClick={autoApprove} className="text-3xl cursor-pointer" width={32} height={20} />
                    }
                        
                        <p className="text-base ">Auto Approve</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       
                        {images?.length ? (
                            images?.map((image, index) => (
                                <Picture key={index} id={image.id} url={image.photoUrl}  />
                            ))
                        ) : (
                            <p className="text-gray-500">No Pictures Available</p>
                          )}
                       
                </div>
         </div>
    )
    
}