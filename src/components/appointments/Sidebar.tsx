import { CalenderIcon, CircleArrowRight,  } from '@/constants'
import { CalendarCheck2, HelpCircle, Menu, Plus,  } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// const navlinks = [
//   {
//     icon: ,
//     label: ,
//     link: ,

//   }
// ]

const Sidebar = () => {
  return (
    <nav className="space-y-4 px-4 py-6 h-full w-full flex flex-col justify-between gap-6">
      <div className="w-full space-y-2">

        <div className="flex gap-4 items-center w-full pb-4">
          <div className="h-14 w-14 bg-blue-700 flex-shrink-0 rounded-full"></div>
          <div className="">
            <p className="text-gray-500">Hello,</p>
            <p className="text-xl font-medium">Manuel</p>
          </div>
        </div>

        <div className="border rounded-xl p-3 text-center w-full space-y-1">
          <h5 className="text-lg font-medium">Get Started</h5>
          <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quos?</p>

          <Link href={'/appointments/create'} className='flex justify-between gap-12 items-center py-3 px-6 bg-blue-700 text-white'>
            <p className="text-medium">Create</p>
            <Plus/>
          </Link>
        </div>

        {
          [1,2,3,4,5].map((items, idx)=>{
            return (
              <Link key={idx} href={'/appointments/tools'} className={` flex gap-4 items-center p-3 rounded-md hover:bg-pink-300 duration-300 group `}>
                <div className="group-hover:text-purple-700 duration-300">
                  <CalendarCheck2/>
                </div>
                <p className="group-hover:text-blue-700 duration-300">Calender</p>
              </Link>

            )
          })
        }

        <div className="space-y-8 py-6 border-y">
          <Link href={'/appointments/tools'} className={` flex gap-4 items-center p-3 rounded-md hover:bg-pink-300 duration-300 group`}>
            <div className="group-hover:text-purple-700 duration-300">
              <Menu/>
            </div>
              <p className="group-hover:text-blue-700 duration-300">More Tools</p>
          </Link>

          <Link href={'/appointments/help'} className={` flex gap-4 items-center p-3 rounded-md hover:bg-pink-300 duration-300 group`}>
            <div className="group-hover:text-purple-700 duration-300">
                <HelpCircle/>
              </div>
                <p className="group-hover:text-blue-700 duration-300">User Help</p>
          </Link>
        </div>

      </div>

      <div className=" w-full ">
        <button type="button" className="flex gap-4 items-center">
          <CircleArrowRight/>
          <p>Log Out</p>
        </button>
      </div>
      
      {
        // navlinks.map(({icon,label,link},idx)=>{

        //   return (

        //   )
        // })
      }

    </nav>
  )
}

export default Sidebar