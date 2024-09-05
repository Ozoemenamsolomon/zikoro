
import { BriefCase, CircleArrowRight, CalenderIcon } from '@/constants';
import { getUser, useLogOut } from '@/hooks';
import { Bell, Calendar, Grip, HelpCircle, Link2, Menu, Plus, Settings, BriefcaseIcon, Users, BarChartBig } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAppointmentContext } from './context/AppointmentContext';
import MenuBox from './ui/MenuBox';
import useUserStore from '@/store/globalUserStore';

const navlinks = [
  {
    icon: Calendar,
    label: 'Calendar',
    link: `/appointments/calendar`,
  },
  {
    icon: BriefCase,
    label: 'Appointments',
    link: `/appointments`,
  },
  {
    icon: Link2,
    label: 'Schedules',
    link: `/appointments/schedule`,
  },
  // {
  //   icon: Users,
  //   label: 'Contacts',
  //   link: `/appointments/contacts`,
  // },
  {
    icon: BarChartBig,
    label: 'Analytics',
    link: `/appointments/analytics`,
  },
  // {
  //   icon: Bell,
  //   label: 'Notification',
  //   link: `/appointments/notification`,
  // },
  // {
  //   icon: Settings,
  //   label: 'Settings',
  //   link: `/appointments/settings`,
  // },
];

const Sidebar = () => {
  const pathanme = usePathname()
  const  {user} = useUserStore()
  const {logOut} = useLogOut('/bookings')
  const [open, setOpen] = useState('')
  
  return (
    <nav className="space-y-4 text-sm px-6 py-6 h-full w-full flex flex-col justify-between gap-">
      <div className="w-full space-y-2">

        <div className="flex gap-4 items-center w-full pb-2">
          <div className=" h-14 w-14 flex-shrink-0 rounded-full flex justify-center items-center " 
          style={{background: `linear-gradient(153.33deg, #001FCC -41.59%, #FFFFFF 104.99%) `}}
          >
            <div className="h-12 w-12 bg-zikoroBlue flex-shrink-0 rounded-full" 
            // style={{background: `linear-gradient(153.33deg, #001FCC -41.59%, #FFFFFF 104.99%) `}}
            >

            </div>
          </div>
          <div>
            <p className="text-gray-500 leading-tight">Hello,</p>
            <p className="text-base font-medium">{user?.firstName}</p>
          </div>
        </div>

        <div className="border rounded-xl p-2 text-center w-full space-y-1">
          <h5 className="text-base font-medium">Get Started</h5>
          <p className="text-[#1F1F1F] pb-1 text-sm">Creating and managing your schedules couldn’t be easier.</p>

          <Link href={'/appointments/create'} className='flex justify-between gap-6 items-center py-2 px-5 text-white rounded-md'
          style={{background: `linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)`
          }}
          >
            <p className="text- font-medium">Create</p>
            <Plus size={16} />
          </Link>
        </div>

        <div className="space-y-1 py-6">
          {navlinks.map(({ icon, label, link }, idx) => {
            const Icon = icon;
            return (
              <Link key={idx} href={link} className={`${pathanme===link?'bg-gradient-to-r from-slate-200 to-purple-200':''} flex gap-4 items-center px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group `}>
                <div>
                  <Icon size={18} className={`${pathanme===link?'text-purple-800':''} group-hover:text-purple-800 duration-300 `}
                  // style={{background: `linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)`}}
                  />
                </div>
                <p className={`${pathanme===link?'text-blue-700':''} group-hover:text-blue-700 font-medium duration-300 `}>{label}</p>

                {label === 'Notification' ? (
                  <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-gradient-to-l from-purple-700 to-blue-700">
                    {2}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* <div className="space-y-2 py-4 border-y">
          <button onClick={()=>setOpen(open==='moretools' ? '' : 'moretools')} className={`relative flex gap-4 items-center p-2 rounded-md  hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group`}>
            <div className="group-hover:text-purple-800 duration-300">
              <Grip size={18}/>
            </div>
            <p className="group-hover:text-blue-700 font-medium duration-300">More Tools</p>

            <MenuBox open={open} setOpen={setOpen} />
          </button>

          <Link href={'/appointments/help'} className={`flex gap-4 items-center p-2 rounded-md  hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group`}>
            <div className="group-hover:text-purple-800 duration-300">
              <HelpCircle size={18} />
            </div>
            <p className="group-hover:text-blue-700 font-medium duration-300">User Help</p>
          </Link>
        </div> */}

      </div>

      <button onClick={()=>logOut()} type="button" className="flex w-full gap-4 items-center p-2 rounded-md hover:bg-gradient-to-r hover:from-slate-200  hover:to-purple-200 duration-300 group">
      <div className="group-hover:text-purple-700 duration-300">
        <CircleArrowRight />
      </div>
        <p className='group-hover:text-blue-700 font-medium duration-300"'>Log Out</p>
      </button>
    </nav>
  );
};

export default Sidebar;
