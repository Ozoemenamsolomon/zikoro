'use client'

import { cn, useClickOutside } from '@/lib';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React,{useRef} from 'react';

interface MoreToolsProps {
  open: string; className?:string;
  setOpen: (open: string) => void;
}

const MenuBox: React.FC<MoreToolsProps> = ({ open, className, setOpen }) => {
    const {push} = useRouter()
    const ref = useRef(null)
    useClickOutside(ref, ()=>setOpen(''))
  return (
    <div ref={ref} className={cn(`${open ? 'max-w-screen ' : 'max-w-0 overflow-hidden'} z-50 transform absolute transition-all duration-1000 m-1 left-[100%] `, className) }>
    
    {open==='moretools'  && 
    <div
      className={`rounded-lg w-52 p-2 bg-gradient-to-r from-slate-100 to-purple-100`} 
    >
      <div
        className="h-full bg-white/20 pb-12  rounded-md w-full grid grid-cols-2 gap-3 p-4 "
      >
        <button
          onClick={() => {
            push('/events')
            setOpen('')
        }}
          className="w-full"
        >
            <Image src={'/zikoro-events.png'} alt='zikoro events' height={150} width={200} className='w-full object-contain shrink-0'/>
        </button>
      </div>
    </div> 
    }


    </div>
  );
};

export default MenuBox;
