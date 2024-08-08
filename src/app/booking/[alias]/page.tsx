import Booking from '@/components/appointments/booking';
import React from 'react'

const page = async ({params:{ alias }} : {params: { alias: string }}) => {
    return <Booking alias={alias} />;
}

export default page