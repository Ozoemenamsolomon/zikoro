import ContactLayout from '@/components/appointments/contactPage'
import contacts from '@/components/appointments/contactPage/constants'
import ContactMedia from '@/components/appointments/contactPage/ContactMedia'
import ContactSubLayout from '@/components/appointments/contactPage/ContactSubLayout'
import React from 'react'

const ContactMediaPage = () => {
  return (
    <ContactLayout contacts={contacts}>
        <ContactSubLayout>
            <ContactMedia />
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactMediaPage