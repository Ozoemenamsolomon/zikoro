import Main from '@/components/appointments/Main'
import LinksPage from '@/components/appointments/links'
import React from 'react'

const page = async () => {
 /**
   const {data,error} = await supabaseServerClient.from('appointmentLinks').select('*')
  */
 
  return (
    <Main>
        <LinksPage appointmnetLinks={[]}/>
    </Main>
  )
}

export default page