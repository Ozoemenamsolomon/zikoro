import Main from '@/components/appointments/Main'
import LinksPage from '@/components/appointments/links'
import { supabaseServerClient } from '@/utils/supabase/server'
import React from 'react'

const dynamic = 'dynamic'
const page = async () => {
  const {data,error} = await supabaseServerClient.from('appointmentLinks').select('*')
  // console.log({data,error})
  return (
    <Main>
        <LinksPage appointmnetLinks={data || []}/>
    </Main>
  )
}

export default page