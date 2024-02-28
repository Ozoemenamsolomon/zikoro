"use client"
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {IoIosCheckmarkCircle} from "react-icons/io"
import {IoClose} from "react-icons/io5"
import {toast } from 'react-toastify';
import { supabase } from "../utils/Utils"


export default function AwaitAppPic({url, id}){

        const approve = async (imageId: string) => {
          try {        
            // Update the parameters for the specified image
            const { error } = await supabase
              .from('eventPhotos')
              .update({"photoStatus": 'approved'})
              .eq('id', imageId);
      
            if (error) {
              throw error;
            } toast.success('Photo Approved') 

            } catch (error) {
              
            }
        };
               
  
        const reject = async (imageId: string) => {
            try {        
              // Update the parameters for the specified image
              const { error } = await supabase
                .from('eventPhotos')
                .update({"photoStatus": 'rejected'})
                .eq('id', imageId);
        
              if (error) {
                throw error;
              } toast.error('Photo Rejected');

            } catch (error) {
              toast.error(`Error Rejecting Photo`);
            }
          };

   

        useEffect(() => {

        }, [])


    return (
                <div className="relative ">
                
                        <div className="absolute bg-black rounded-full flex opacity-45 items-center justify-center w-8 h-8 top-4 right-4 cursor-pointer  ">
                                <IoClose onClick={() => reject(id)} className="text-white"/>
                        </div>

                       
                        <div onClick={ () => approve(id)} className="absolute bottom-2 left-2 flex space-x-2 items-center text-base p-1 bg-white cursor-pointer">
                            <IoIosCheckmarkCircle fill="#00D685" className=""  />
                            <span className=""> Approve </span>
                        </div>
                        
                          <Image className="object-cover h-60" src={url} alt="picture" width={263.5} height={241} />
                        
                </div>
        )
}