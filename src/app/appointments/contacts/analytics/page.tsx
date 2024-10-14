import ContactLayout from '@/components/appointments/contactPage'
import contacts from '@/components/appointments/contactPage/constants'
import ContactSubLayout from '@/components/appointments/contactPage/ContactSubLayout'
import React from 'react'

const ContactAnalyticsPage = () => {
  return (
    <ContactLayout contacts={contacts}>
        <ContactSubLayout>
            <main className='text-4xl font-bold p-8'>Contact Analytics</main>
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactAnalyticsPage