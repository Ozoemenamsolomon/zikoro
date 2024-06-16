import Appointments from '@/components/appointments/Appointments'
import Main from '@/components/appointments/Main'
import React from 'react'

const AppointmentsPage = ({children}:{children:React.ReactNode}) => {
  return (
    <Main>
      <Appointments/>
    </Main>
  )
}

export default AppointmentsPage