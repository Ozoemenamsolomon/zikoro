import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ContactHeader from "@/components/contact/ContactHeader"
import ContactForm from "@/components/contact/ContactForm"
// import { Montserrat } from "next/font/google";

// const montserrat = Montserrat({
//     weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
//     subsets: ["latin"],
//     display: "swap",
//     fallback: ["Arial", "sans-serif"],
//   });


export default function Contact() {
  return (
    <div className="">
        <Navbar/>
        <ContactHeader/>
        <ContactForm/>
        <Footer/>
    </div>
  )
}
