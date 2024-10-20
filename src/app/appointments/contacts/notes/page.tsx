import ContactLayout from '@/components/appointments/contactPage'
import contacts from '@/components/appointments/contactPage/constants'
import ContactNotes from '@/components/appointments/contactPage/ContactNotes'
import ContactSubLayout from '@/components/appointments/contactPage/ContactSubLayout'
import React from 'react'

const ContactNotesPage = () => {
  return (
    <ContactLayout contacts={contacts}>
        <ContactSubLayout>
            <ContactNotes/>
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactNotesPage