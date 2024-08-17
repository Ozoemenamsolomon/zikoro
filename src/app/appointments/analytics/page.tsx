import React from 'react'
import Main from '@/components/appointments/Main'
import Analytics from '@/components/appointments/Analytics'
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { redirect } from 'next/navigation';
// import { cookies } from "next/headers";

const AnalyticsPage = async () => {
  // const supabase = createRouteHandlerClient({ cookies });

  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();
  // if (!user) {
  //   console.error("Authentication error:", authError?.message);
  //   redirect('/login')
  // }

  // const {
  //   data: userData,
  //   error: userError,
  // } = await supabase.from('users').select('*').eq('userEmail', user.email).single();

  // if (!userData) {
  //   console.error("No user data found for email:", userData.userEmail);
  //   redirect('/login')
  // }

  // console.log({user,userData})

  return (
    <Main>
      <Analytics />
      {/* <Analytics user={userData}/> */}
    </Main>
  )
}

export default AnalyticsPage