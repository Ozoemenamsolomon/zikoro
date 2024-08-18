import { cn } from '@/lib'
import React from 'react'

const LoadingState = ({className}:{className?:string}) => {
  return (
    <div className={cn('w-full h-40 bg-[#F9FAFF] animate-pulse',className)}></div>
  )
}

export default LoadingState