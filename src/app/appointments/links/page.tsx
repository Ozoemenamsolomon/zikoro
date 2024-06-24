import Main from '@/components/appointments/Main'
import LinksPage from '@/components/appointments/links'
import { supabaseServerClient } from '@/utils/supabase/server'
import React from 'react'

const page = async ({ searchParams }: { searchParams: { [key: string]: string | string[] } }) => {
  const {data,error} = await supabaseServerClient.from('appointmentLinks').select('*')
  console.log({data,error, searchParams}, )
  return (
    <Main>
        <LinksPage appointmnetLinks={data || []}/>
    </Main>
  )
}

export default page