'use client'

import React from 'react'
import { contactNavSub } from './constants'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const ContactSubNav = () => {
    const pathname = usePathname();
  return (
    <div className="w-full flex overflow-auto no-scrollbar gap-1 items-center px-6 py-3 border-b border-slate-200   sticky top-0 bg-white z-20">
        {contactNavSub.map(({ label, link }) => (
            <Link
            href={link}
            key={label}
            className={`px-3 py-1 rounded text-nowrap  hover:ring-1 hover:ring-gray-200 duration-300 ${
                pathname === link ? "bg-blue-600 text-white" : ""
            }`}
            >
            {label}
            </Link>
        ))}
    </div>
  )
}

export default ContactSubNav