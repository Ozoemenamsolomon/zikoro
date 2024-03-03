"use client"
import React from 'react'
import {useState} from "react"
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Image from "next/image"

export default function Homepage() {

    const pathname = usePathname();

    const links = [
        {
          name: "Features",
          href: "/features",
        },
        {
          name: "Use Cases",
          href: "/use-cases",
        },
        {
          name: "Resources",
          href: "/resources",
        },
        {
          name: "Pricing",
          href: "/pricing",
        },
        {
          name: "Contact Us",
          href: "/contact-us",
        },  

      ];

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (

    <nav className="bg-white p-4 border-b-[1px] border-indigo-500 text-base">

        <div className="container flex mx-auto lg:max-w-6xl justify-between items-center pb-2">
            <div>
                 <Image src="/zikoro.png" className='' alt='' width={128} height={35} />
            </div>

                <div className="hidden md:block">
                    {links.map(({ name, href, }, index) => {
                        return (
                        <Link
                            key={index}
                            href={href}
                            className={` ${
                            pathname === href
                                ? "text-zikoroBlue"
                                : "px-4 text-lg font-medium font-montserrat"
                            }`}
                        >
                            {name}
                        </Link>
                        );
                    })}

                </div>

                <div className=' gap-4 hidden md:flex'>
                    <button className=' text-white bg-gradient-to-tr text-base from-custom-gradient-start to-custom-gradient-end  p-2 rounded-md '>
                        Start For Free
                    </button>

                    <button className='text-base text-zikoroBlue bg-transparent border border-indigo-700 p-2 rounded-md '>
                        Login
                    </button>
                </div>

            <div className="md:hidden">

            <button className="text-black" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden bg-gradient-to-tr max-w-full h-screen from-custom-gradient-start to-custom-gradient-end">
                <div className="flex flex-col items-center text-white ">
                {links.map(({ name, href }) => {
                        return (
                        <Link
                            href={href}
                            className={` ${
                            pathname === href
                                ? "text-zikoroBlue border-b-2 border-zikoroBlue"
                                : "px-2 fon"
                            }`}
                        >
                            {name}
                        </Link>
                        );
                    })}
                </div>
            </div>
        )}

    </nav>
    );
}