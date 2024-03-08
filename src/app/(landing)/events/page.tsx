"use client"
import React from 'react'
import Navbar from '@/components/index/Navbar'
import Footer from '@/components/index/Footer'
import EventHeader from '@/components/index/EventHeader'
import { Montserrat } from "next/font/google";
import EventList from '@/components/index/EventList'
import FeaturedEventList from '@/components/index/FeaturedEventList'
import CitiesEventList from '@/components/index/CitiesEventList'
import CategoryEventList from '@/components/index/CategoryEventsList'

const montserrat = Montserrat({
    weight: ['100', '200','300', '400', '500','600', '700', '800'],
    subsets: ['latin'],
    display:'swap',
    fallback: ['Arial', 'sans-serif'],
  });

export default function Events() {
   
    return (
        <div className={`${montserrat.className} `}>
            <div className='z-[100px]'>
                <Navbar />
            </div>
                <EventHeader/>
                <EventList/>
                <FeaturedEventList/>
                <CitiesEventList/>
                <CategoryEventList/>
                <Footer/>
        </div>
    )
}