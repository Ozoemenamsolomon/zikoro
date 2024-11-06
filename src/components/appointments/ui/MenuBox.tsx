'use client'

import { cn,  } from '@/lib';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React  from 'react';
import Link from 'next/link'

interface MoreToolsProps {
  open: string; className?:string;
  setOpen: (open: string) => void;
}

const MenuBox: React.FC<MoreToolsProps> = ({ open, className, setOpen }) => {
    const {push} = useRouter()
   
  return (
    <div  className={cn(`${open ? 'visible opacity-100' : 'opacity-0 invisible'} z-50 transform absolute transition-all duration-300 top-8`, className) }>
    
    <div
      className={`rounded-lg w-full p-2 bg-gradient-to-r from-slate-100 to-purple-100`} 
    >
      <div
        className="h-full bg-white/20 pb-12  rounded-md w-full grid grid-cols-2 gap-3 p-4 "
      >
        <Link href='/events' target='_blank'
          onClick={() => {
            setOpen('')
        }}
          className="w-full"
        >
            <Image src={'/zikoro-events.png'} alt='zikoro events' height={150} width={250} className='w-full object-contain shrink-0'/>
        </Link>
      </div>
    </div> 


    </div>
  );
};

export default MenuBox;
