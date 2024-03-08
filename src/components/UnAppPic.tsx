"use client"
import React, {useState } from "react"
import Image from "next/image"
import {IoIosCheckmarkCircle} from "react-icons/io"
import {toast } from 'react-toastify';
import { supabase } from "../utils/Utils"

type UnAppPicProps = {
        url: string,
        id: number,
}

export default function UnAppPic({url, id} : UnAppPicProps ){

        const reApprove = async(imageId: number) => {
                try {        
                        // Update the parameters for the specified image
                        const { error } = await supabase
                                .from('eventPhotos')
                                .update({"photoStatus": 'awaiting'})
                                .eq('id', imageId);
                        
                        if (error) {
                                throw error;
                        } toast.success('Picture Re-Approved');
                
                        } catch (error) {
                        toast.error(`Error Rejecting: ${error}`);
                        }
                }


    return (
                <div className="relative">
                        
                                <div onClick={() => reApprove(id)} className="absolute bottom-2 left-2 flex space-x-2 items-center text-base p-1 bg-white cursor-pointer  ">
                                        <IoIosCheckmarkCircle fill="#001FCC" className="" />
                                        <span className=""> Re-Approve </span>
                                </div> 
                         
                                <Image className="object-cover h-60 w-full" src={url} alt="picture" width={263.5} height={231}/>
                 </div>
        )
    
}