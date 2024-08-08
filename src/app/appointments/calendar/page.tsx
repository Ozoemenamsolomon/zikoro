import Main from '@/components/appointments/Main';
import React from 'react';
import Calender from '@/components/appointments/calender/Calender';
// import { createClient } from '@/utils/supabase/server';

interface SearchParams {
  viewing: 'month' | 'week';
  date: Date;
}

const CalenderPage: React.FC<{ searchParams: SearchParams }> = async ({ searchParams:{viewing,date} }) => {
  // const supabase = createClient()
  // const {data:user, error:errorUser} = await supabase.auth.getUser()
  // if(user){
  //   const {data:userData,error:userError} = await supabase
  //       .from('users')
  //       .select('*')
  //       .eq('userEmail', user.email)

  //   const {data, error} = await supabase
  //       .from('bookings')
  //       .select('*, appointmentLinkId(*, createdBy(userEmail, organization, firstName, lastName, phoneNumber))')
  //       .eq("createdBy", userData.id)

  //   console.log({data,user,error,userData, errorUser, userError})
  // }

  return (
    <Main>
      <Calender viewing={viewing} date={date} />
    </Main>
  );
};

export default CalenderPage;
