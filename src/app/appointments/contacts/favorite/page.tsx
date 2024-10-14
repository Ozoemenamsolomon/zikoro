import ContactLayout from '@/components/appointments/contactPage'
import contacts from '@/components/appointments/contactPage/constants'
import React from 'react'

const Favorites = () => {
  return (
    <ContactLayout contacts={contacts}>
        <main className='text-4xl font-bold p-8'>Favorite Contact</main>
    </ContactLayout>
  )
}
  
export default Favorites