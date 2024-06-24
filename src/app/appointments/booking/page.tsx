import Booking from '@/components/appointments/booking'
import { supabaseServerClient } from '@/utils/supabase/server'
import React from 'react'

const BookingPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] } }) => {
  const {data,} = await supabaseServerClient
                              .from('appointmentLinks')
                              .select('*')
                              .eq('id', searchParams?.b)
                              .single()

const {data:user,error} = await supabaseServerClient.auth.getUser()
console.log({data, user, error})

  return (
    <Booking appointmnetLink={data} />
  )
}

export default BookingPage
