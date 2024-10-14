'use client'

import React from 'react'
import ScheduleAppointment from './ScheduleAppointment'
import { useAppointmentContext } from '../context/AppointmentContext'
import PreviousAppointments from './PreviousAppointments'
import UpcomingAppointments from './UpcomingAppointments'

const ArticleTwo = () => {
  const {contact} = useAppointmentContext()
  return (
    <div className="w-full p-6 md:px-2 min-h-screen space-y-5 bg-white relative z-10">
        <div className=" border rounded-md text-center space-y-3 w-full">
          <div className="text-center  rounded-md w-full p-4 bg-baseBg border-b font-semibold">Schedule Appointment</div>
          <div className="p-3">
            
            <p className="pb-3">Choose a date and schedule an appointment with this contact</p>
            <ScheduleAppointment contact={contact!} appointmentLinks={[]} />
          </div>
        </div>

        <div className=" border rounded-md space-y-3 w-full">
          <div className="text-center border-b rounded-md w-full p-3 py-4   font-semibold bg-baseBg">Previuos Appointments</div>
          <PreviousAppointments contact={contact!} />
        </div>

        <div className=" border rounded-md  space-y-3 w-full">
        <div className="text-center border-b rounded-md w-full p-4  font-semibold bg-baseBg">Upcoming Appointment(s)</div>
          <UpcomingAppointments contact={contact!} />
        </div>


    </div>
  )
}

export default ArticleTwo