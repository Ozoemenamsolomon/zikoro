import ContactLayout from '@/components/appointments/contactPage'
import contacts from '@/components/appointments/contactPage/constants'
import React from 'react'

const Contacts  = () => {
  return (
      <ContactLayout contacts={contacts}/>
  )
}

export default Contacts 