import CreateAppointments from '@/components/appointments/create'
import { supabaseServerClient } from '@/utils/supabase/server'
import React from 'react'

const EditAppointmentsPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] } }) => {
  const {data,error} = await supabaseServerClient
                              .from('appointmentLinks')
                              .select('*')
                              .eq('id', searchParams?.d)
                              .single()

                              console.log({data})
  return (
    <CreateAppointments editData={data}/>
  )
}

export default EditAppointmentsPage
