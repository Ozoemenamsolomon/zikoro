import { FolderOpen } from 'lucide-react'
import React from 'react'

const EmptyList = ({size,icon,text}:{
    size?:string,icon?:React.ReactNode,text?:string
}) => {
  return (
    <div className="h-96 w-full flex flex-col gap-2 justify-center items-center">
       {icon || <FolderOpen size={size||60} className='text-purple-100'/>}
        <p className="text-center text-slate-500">{text || 'No items'}</p>
    </div>
  )
}

export default EmptyList