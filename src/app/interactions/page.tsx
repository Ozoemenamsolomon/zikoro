"use client"
import React from 'react'
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Interactions() {

    const pathname = usePathname();

    const links = [

        {
            name: "Photos",
            href: "/interactions/photos",
        },

        {
          name: "Discussions",
          href: "/interactions/discussions",
        },

        {
            name: "Social Wall",
            href: "/interactions/social",
        },

        {
            name: "StampIT",
            href: "/interactions/stamp",
        },

        {
            name: "Leaderboard",
            href: "/interactions/leaderboard",
        },

    ]

    return (
        <div className='border-y-[1px] border-gray-100 mt-4 pb-3'>
                <div className='flex justify-between bg-white pt-2'>

                                    <div className='flex gap-12 text-gray-500 sticky top-0 pb-2 '>
                                    {
                                        links.map(({ name, href }) => { 
                                        return (
                                            <Link
                                            href={href}
                                            className={` ${
                                            pathname === href
                                                ? "text-zikoroBlue"
                                                : ""
                                            }`}
                                            >
                                                {name}
                                            </Link>
                                        )
                                    })

                                    }
                                    </div>
                </div>

        </div>
    )
    
  
}