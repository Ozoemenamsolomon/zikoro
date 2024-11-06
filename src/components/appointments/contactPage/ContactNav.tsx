'use client'
import React from 'react'
import { contactNav } from './constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const ContactNav = () => {
    const pathname = usePathname();
  return (
    <div className="w-full sticky top-0 overflow-auto no-scrollbar flex gap-3 items-center px-6 py-3 border-b ">
        {contactNav.map(({ label, link }) => (
        <Link
            key={label}
            href={link}
            className={`px-4 py-1 rounded   hover:border-gray-100 duration-300 ${
            link === pathname ? "text-basePrimary" : ""
            }`}
        >
            {label}
        </Link>
        ))}
    </div>
  )
}

export default ContactNav