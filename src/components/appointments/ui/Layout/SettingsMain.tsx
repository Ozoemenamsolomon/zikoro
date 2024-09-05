import { cn } from '@/lib'
import React from 'react'
import Aside from './Aside'
import Article from './Article'

interface MainProp {
    className?:string,
    navlinks?: any[],
    children: React.ReactNode
}

const SettingsMain:React.FC<MainProp> = ({className, children}) => {

  return (
    <main className={cn("w-full flex-1 h-screen flex gap-0 bg-white border rounded-lg",className)}>
        <Aside 
            className='shrink-0 border-r sticky top-0 grid py-8 px-4'
        />
        <Article className='flex-1 h-full p-6'>
            {children}
        </Article>
    </main>
  )
}

export default SettingsMain