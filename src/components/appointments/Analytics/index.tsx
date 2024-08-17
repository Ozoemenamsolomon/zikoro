'use client'

import React, { useEffect } from 'react'

import SectionOne from './SectionOne'
import SectionTwo from './SectionTwo'
import SectionThree from './SectionThree'
import SectionFour from './SectionFour'
import { UserType } from '@/types/appointments'
import { useAppointmentContext } from '../context/AppointmentContext'
import SectionFive from './SectionFive'

const Analytics = () => {
  const {user, setUser} = useAppointmentContext()
  // console.log({userD:user})
  // useEffect(() => {
  //   setUser(user)
  // }, [user])
  
  return (
    <div className='py-8 space-y-8'>
        <section className="grid xl:grid-cols-2 gap-8    ">

           <SectionOne user={user!}/>

            <SectionTwo user={user!}/>
        </section>

       <SectionThree user={user!}/>
       <SectionFive user={user!}/>

        <SectionFour user={user!}/>
    </div>
  )
}

export default Analytics