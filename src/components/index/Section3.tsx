"use client"
import React from 'react'
import Image from "next/image"

export default function Header() {
   
    return (
        <div className='mt-28 bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end'>
            <div className='flex px-20 py-28 mx-auto items-center justify-between'>
                <div className='flex space-x-8'>
                        <Image src="/timer.png" className='' alt="" width={20} height={20} />
                        <p className='text-4xl text-white'>10 mins <br /> <span className=''> to publish an event </span> </p>
                </div>

                <div>
                        <Image src="/people.png" className='' alt="" width={50} height={50} />
                        <p>10 mins <span> to publish an event </span> </p>
                </div>

                <div>
                        <Image src="/database.png" className='' alt="" width={50} height={50} />
                        <p>10 mins <span> to publish an event </span> </p>
                </div>
            </div>
        </div>
    )
}