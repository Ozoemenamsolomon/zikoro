"use client"
import React from 'react'
import Image from "next/image"


export default function Header() {
   

    return (
        <div className='mt-20 max-w-full mx-auto lg:max-w-6xl '>
            <p className='gradient-text font-bold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center text-4xl'>Made for people. <br/> Built for engagements and connections.</p>

            <div className='bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end flex justify-center items-center w-full h-[660px] mt-8 rounded-3xl cursor-pointer'>
                <Image src="/play.png" className='' alt="" width={84} height={84} />
            </div>
        </div>
    )
}