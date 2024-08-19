import { cn } from '@/lib'
import { FileWarning,  } from 'lucide-react'
import React from 'react'

const ErrorState = ({className}:{className?:string}) => {
  return (
    <div className={cn('w-full h-40 bg-[#F9FAFF]  flex items-center flex-col justify-center gap-2',className)}>
        <FileWarning className='text-slate-200' size={60}/>
        <p className=""></p>
    </div>
  )
}

export default ErrorState