import React from 'react'
import Appointments from '../../components/appointments/appointents/Appointments'

const AppointmentsPage = async ({children}:{children:React.ReactNode}) => {

  return (
      <Appointments/>
  )
}

export default AppointmentsPage