'use client'
import React, { useState } from 'react'
import { cn } from '@/lib'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {  ChevronLast } from 'lucide-react'
import {
    LucideIcon,
    UserCircle,Link2,
    Users2, 
    } from "lucide-react";

interface AsideProp {
    className?:string,
    asidelinks?:any[]
  }

interface AsideLink {
    label: string;
    icon: React.ReactNode;
    path: string;
    roles?: string[];
    alert?: boolean;
    active?: boolean;
    permissions?: string[];
}
      
const asidelinks: AsideLink[] = [
    {
        label: "Profile",
        icon: <UserCircle size={20}/>,
        path: "/appointments/settings/profile",
    // roles: staff,
    },
    {
        label: "Links",
        icon: <Link2 size={20}/>,
        path: "/appointments/settings/links",
        // roles: staff,
    },
    {
        label: "Teams",
        icon: <Users2 size={20}/>,
        path: "/appointments/settings/teams",
        // roles: staff,
    },
];

  const Aside:React.FC<AsideProp> = ({className,  }) => {
    const [expanded, setExpanded] = useState(true);
    const pathname = usePathname()

  return (
    <aside  className={cn("",className)}>
        <nav className="flex flex-col h-full gap-3 text-gray-600">
            <div className="">
                <button onClick={()=>setExpanded(curr=>!curr)} className=" bg-slate-50 hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 hover:text-zikoroBlue duration-300 group
                p-2 rounded-md   ">
                    <ChevronLast size={20} className={expanded ? 'rotate-180  transitionn-all duration-200' : 'rotate-0 transitionn-all duration-200'}/>
                </button>
            </div>

            <ul className="flex-1 flex flex-col gap-2">
                {
                    asidelinks?.map(({icon,label,path,alert,roles},idx) => {
                        let isActive = pathname===path
                        return (
                            <Link href={path}
                                className={`
                                    relative flex items-center p-2 rounded-md
                                    font- cursor-pointer
                                    transition-colors group
                                    hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 hover:text-zikoroBlue duration-300 group
                                    ${isActive ? 'bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 text-zikoroBlue' : ' '}
                                `}
                            >
                                {icon}
                                <span
                                    className={`overflow-hidden transition-all text-nowrap whitespace-nowrap ${
                                    expanded ? 'w-28 ml-3' : 'w-0 '
                                    }`}
                                >
                                    <p className={isActive ? 'font-semibold' : ''}>{label}</p>
                                </span>

                                {alert && (
                                    <div
                                    className={`absolute right-4 w-4 h-4 rounded-full bg-green ${
                                        expanded ? '' : 'top-2'
                                    }`}
                                    />
                                )}

                                {!expanded && (
                                    <div
                                    className={`
                                    absolute left-full rounded-md px-2 py-1 ml-1
                                    bg-pink-50 text-zikoroBlue text-sm
                                    invisible opacity-20 -translate-x-3 transition-all
                                    group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                                    text-nowrap
                                `}
                                    >
                                    {label}
                                    </div>
                                )}
                                </Link>
                        )
                    })
                }
            </ul>
        </nav>
    </aside>
  )
}

export default Aside