import Link from 'next/link'
import React from 'react'
import TabSwitch from './TabSwitch'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'

const ShopfrontLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='bg-baseBg hide-scrollbar min-h-screen w-full  '>
        <header className="fixed top-0 w-full bg-white  z-40">
            <div className="max-w-7xl  mx-auto p-4  w-full">
                <div className="flex items-center gap-2">
                    <div className="rounded-full h-14 w-14 bg-zikoroBlue"></div>
                    <p className="">Ifunanya Nwuzor</p>
                </div>
            </div>
        </header>
         <TabSwitch/>
        <div className="min-h-screen max-w-7xl mx-auto p-4 flex flex-col  justify-between gap-8">
            <div className='pt-24 w-full h-full'>{children}</div>
            
            <footer className="flex flex-col sm:flex-row text-[12px] shrink-0 justify-between w-full gap-x-4 items-center">
                <h6>Pawered by Zikoro - Bookings</h6>
                <Link href={'/appointments/create'} className='flex items-center gap-'>Create your appointment <ArrowTopRightIcon/> </Link>
            </footer>
        </div>
    </main>
  )
}

export default ShopfrontLayout