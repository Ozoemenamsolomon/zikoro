import React from 'react'
import ContactSubNav from './ContactSubNav'

type ContactProps = {
    children: React.ReactNode;
  };
  
const ContactSubLayout: React.FC<ContactProps> = ({children}) => {
  return (
    <>
        <ContactSubNav/>
        <div className="bg-white z-10 relative">
        {children}

        </div>
    </>
  )
}

export default ContactSubLayout