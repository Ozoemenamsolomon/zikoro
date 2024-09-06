'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TabSwitch = () => {
    const pathname = usePathname()
  return (
    <section className="fixed px-4 bottom-16 sm:bottom-12 w-full flex justify-center">
        <div className="border-2 border-zikoroBlue max-w-sm rounded-full bg-opacity-50 bg-purple-100 flex p-1 gap-1">
            {
                [
                    {
                        label:'Booking',
                        link:'/appointments/shop-front/booking'
                    },
                    {
                        label:'Profile',
                        link:'/appointments/shop-front/profile'
                    },
                    {
                        label:'Images',
                        link:'/appointments/shop-front/images'
                    },
                ].map(({label,link},idx)=>{
                    return (
                        <Link href={link} key={idx} 
                        className={`${pathname===link ? 'bg-zikoroBlue text-white' : ''} px-6 py-1.5 rounded-full hover:bg-white duration-300  `}
                        >
                            {label}
                        </Link>
                    )
                })
            }
        </div>
    </section>
  )
}

export default TabSwitch