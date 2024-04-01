import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ContactHeader from "@/components/contact/ContactHeader"
import ContactForm from "@/components/contact/ContactForm"



export default function Contact() {
  return (
    <div className=''>
        <Navbar/>
        <ContactHeader/>
        <ContactForm/>
        <Footer/>
    </div>
  )
}
