'use client'
import Navbar from "@/components/index/Navbar"
import Section1 from "@/components/index/Section1"
import Section2 from "@/components/index/Section2"
import Section3 from "@/components/index/Section3"
import Features from "@/components/index/Features"
import Section4 from "@/components/index/Section4"
import Section5 from "@/components/index/Section5"
import Footer from "@/components/index/Footer"
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ['100', '200','300', '400', '500','600', '700'],
  subsets: ['latin'],
  display:'swap',
  fallback: ['Arial', 'sans-serif'],
});


export default function Home() {
  return (
    <div className={`${montserrat.className} `}>
        <Navbar/>
        <Section1/>
        <Section2/>
        <Section3/>
        <Features/>
        <Section4/>
        <Section5/>
        <Footer/>
    </div>
  )
}
