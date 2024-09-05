import Appointments from '@/components/appointments/Appointments'
import React from 'react'

const AppointmentsPage = async ({children}:{children:React.ReactNode}) => {

  return (
      <Appointments/>
  )
}

export default AppointmentsPage