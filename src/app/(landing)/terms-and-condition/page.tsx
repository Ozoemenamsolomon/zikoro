'use client'
import React from "react"
import Navbar from "@/components/Navbar"
import TermBody from "@/components/terms/TermsBody"
import Footer from "@/components/Footer"
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: [ '200','300', '400', '500','600', '700', '800'],
  subsets: ['latin'],
  display:'swap',
  fallback: ['Arial', 'sans-serif'],
});


export default function Terms() {
  return (
    <div className={`${montserrat.className} `}>
        <Navbar/>
        <TermBody/>
        <Footer/>
    </div>
  )
}
