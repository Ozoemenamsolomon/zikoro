import React from "react"
import Navbar from "@/components/index/Navbar"
import Footer from "@/components/index/Footer"
import ContactHeader from "@/components/index/ContactHeader"
import ContactForm from "@/components/index/ContactForm"
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ['100', '200','300', '400', '500','600', '700',],
  subsets: ['latin'],
  display:'swap',
  fallback: ['Arial', 'sans-serif'],
});


export default function Home() {
  return (
    <div className={`${montserrat.className} `}>
        <Navbar/>
        <ContactHeader/>
        <ContactForm/>
        <Footer/>
    </div>
  )
}
