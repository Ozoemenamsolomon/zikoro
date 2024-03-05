"use client"
import React from 'react'
import Image from "next/image"
import Facebook from '@/components/svg/Facebook'
import X from '@/components/svg/X'
import Linkedin from '@/components/svg/Linkedin'
import Instagram from '@/components/svg/Instagram'
import { useRouter } from "next/navigation"


export default function Footer() {

    const router = useRouter()

    return (
        <div className='pt-24 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end  '>
            <div className=' max-w-6xl mx-auto px-5 lg:px-0'>
                <div className='lg:flex lg:justify-center lg:items-center'>
                    <Image className='hidden md:inline' src="/zikoroFooter.png" alt="" width={400} height={109} />
                    <Image className=' lg:hidden' src="/zikoroFooter.png" alt="" width={250} height={68} />
                </div>
                    <p className='lg:text-center font-normal text-xs lg:text-xl mt-7'>2A Musari Apena Street, Ewu-Titan, off Labinjo Kalejaiye Street, <span className='inline lg:block'> Mafoluku, Oshodi, Lagos State, Nigeria </span> </p>
            </div>

            <div className='px-5 lg:px-0 mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-5 gap-x-24 gap-y-6 lg:gap-x-24 lg:gap-y-24  max-w-6xl mx-auto'>
                {/* 1st Column */}
                <ul className='flex flex-col space-y-1 lg:space-y-4 '>
                    <li className='text-[15px] lg:text-2xl font-bold'>Company</li>
                    <li className=' text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0'>About  Us</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Careers</li>
                    <li onClick={() => router.push('/contact')} className='text-[13px] lg:text-base font-normal cursor-pointer'>Contact Us</li>
                </ul>

                 {/* 2nd Column */}
                 <ul className='flex flex-col space-y-1 lg:space-y-4'>
                    <li className='text-[15px] lg:text-2xl  font-bold cursor-pointer '>Features</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0'>Ticketing & Registration</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Event Management</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Attendee Engagement</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Gamification</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Exhibitors’ Hub</li>
                </ul>


                 {/* 3rd Column */}
                 <ul className='flex flex-col space-y-1 lg:space-y-4'>
                    <li className='text-[15px] lg:text-2xl font-bold cursor-pointer '>Use cases</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0'>Conferences</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Tradeshows & Exhibitions</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Seminars & Workshops</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Careers</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Education</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Culture & Arts</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Celebrations</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Sports</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Job Fairs</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Festivals</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Charity</li>
                </ul>

                 {/* 4th Column */}
                 <ul className='flex flex-col space-y-1 lg:space-y-4'>
                    <li className='text-[15px] lg:text-2xl font-bold cursor-pointer '>Resources</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0'>Events</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Verify Certificates</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>FAQ</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Affiliates</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>API</li>

                </ul>

                 {/* 5th Column */}
                 <ul className='flex flex-col space-y-1 lg:space-y-4'>
                    <li className='text-[15px] lg:text-2xl font-bold cursor-pointer '>Legal</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0'>Terms and Condition</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Privacy Policy</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Refund Policy</li>
                    <li className='text-[13px] lg:text-base font-normal cursor-pointer'>Cookies</li>
                </ul>

            </div>

            <div className='mt-4 lg:mt-6 border-t-[1px] border-indigo-500 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end  px-5 lg:px-0'>
                <div className='max-w-6xl  mx-auto py-4 lg:py-14 flex justify-between'>
                    <p className='text-[13px] lg:text-base font-normal'> <span className='hidden lg:inline'>Copyright</span> © 2024 - Zikoro <span className='hidden lg:inline'> - an OrthoEx brand</span> </p>
                    
                    {/* social icons */}
                    <div className='flex space-x-3'>
                            <X />
                            <Facebook/>
                            <Linkedin/>
                            <Instagram/>
                    </div>
                </div>
            </div>
            
        </div>
    )
}