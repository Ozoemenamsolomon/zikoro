'use client'

import React, { useEffect } from 'react'

import SectionOne from './SectionOne'
import SectionTwo from './SectionTwo'
import SectionThree from './SectionThree'
import SectionFour from './SectionFour'
import SectionFive from './SectionFive'
import useUserStore from '@/store/globalUserStore';

const Analytics = () => {
  const {user, setUser} = useUserStore()

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