import Appointments from '@/components/appointments/Appointments'
import Main from '@/components/appointments/Main'
import { supabaseServerClient } from '@/utils/supabase/server'
import React from 'react'

const AppointmentsPage = async ({children}:{children:React.ReactNode}) => {
  const {data,error} = await supabaseServerClient.from('appointmentLinks').select('*')
  console.log({data,error})

  return (
    <Main>
      <Appointments appointments={data || []}/>
    </Main>
  )
}

export default AppointmentsPage