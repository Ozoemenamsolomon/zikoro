import ContactLayout from '@/components/appointments/contactPage'
import AppointmentHistory from '@/components/appointments/contactPage/AppointmentHistory'
import contacts from '@/components/appointments/contactPage/constants'
import ContactSubLayout from '@/components/appointments/contactPage/ContactSubLayout'
import React from 'react'

const ContactAppointmentHistory = () => {
  return (
    <ContactLayout contacts={contacts}>
        <ContactSubLayout>
            <AppointmentHistory />
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactAppointmentHistory 