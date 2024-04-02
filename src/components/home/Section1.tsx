'use client'

import React from 'react'
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Section1() {

  const router = useRouter()

  return (
    <div className="mt-40 lg:mt-48 px-5 block">
        <div className="max-w-5xl mx-auto">
            <p className=" text-3xl lg:text-5xl font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center">All-in-one event management platform for all kinds of events</p>
            <p className="max-w-full lg:max-w-3xl mx-auto text-center  text-base lg:text-2xl font-normal mt-5 lg:mt-10">Effortlessly sell multi-tier event tickets, engage your attendees, impress and deliver data-driven results to your event sponsors and exhibitors. It's easy to get started. And it's free. </p>   
            
            <div className="mt-10 flex items-center justify-center mx-auto">
                <button onClick={() => router.push('/home')} className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 rounded-lg">Get Started For Free!</button>
            </div>

            <p className=" text-xs lg:text-sm font-light mt-2 lg:mt-3 text-center">No credit card required.</p>

        </div>
       
       

        <div className="flex items-center justify-center mt-8">
             <Image src="/indexSection1.webp" alt="" width={1240}  height={454} className="hidden lg:block"/>
             <Image src="/indexSection1.webp" alt="" width={376}  height={138} className="block lg:hidden"/>
        </div>
    </div>
  )
}
