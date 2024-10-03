import React from 'react'
import { ContactDummy } from './constants'

const ArticleTwo = ({contact}:{contact:ContactDummy}) => {
  return (
    <div className="w-full p-6 md:px-2 min-h-screen space-y-5 bg-white relative z-10">
        <div className=" border rounded-md text-center space-y-3 w-full">
          <div className="text-center  rounded-md w-full p-4 bg-baseBg border-b font-semibold">Schedule Appointment</div>
          <div className="p-3">
            
          <p className="pb-3">Choose a date and schedule an appointment with this contact</p>
          <button 
            className={`p-3 w-full bg-basePrimary text-center text-white   rounded-md text-nowrap relative
              `}>
                    Schedule Appointment
            </button>
          </div>
        </div>

        <div className=" border rounded-md space-y-3 w-full">
          <div className="text-center border-b rounded-md w-full p-3 py-4   font-semibold bg-baseBg">Last Appointment</div>

          <div className="flex gap-3 w-full p-3">
              <div className="rounded-md text-center overflow-hidden border">
                <div className="p-1 w-20 bg-baseBg text-sm">July</div>
                <div className="p-2 border-t text-base font-semibold">12</div>
              </div>
              <div className="">
                <p>Appointment name</p>
                <p>Fri, Jul 12</p>
                <p>Location</p>
              </div>
            </div>

        </div>

        <div className=" border rounded-md  space-y-3 w-full">
        <div className="text-center border-b rounded-md w-full p-4  font-semibold bg-baseBg">Upcoming Appointment(s)</div>

        <div className="h-full min-h-40 flex flex-col justfiy-between gap-3 overflow-auto hide-scrollbar">

          <div className=" px-3 divide-y">
            {
              [...Array(5)].map((_,idx)=>
                <div className="py-2" key={idx}>
                <div className="flex gap-3 w-full text-">
                  <div className="rounded-md text-center overflow-hidden border">
                    <div className="p-1 w-20 bg-baseBg text-sm">July</div>
                    <div className="p-2 border-t text-base font-semibold">12</div>
                  </div>
                  <div className="">
                    <p>Appointment name</p>
                    <p>Fri, Jul 12</p>
                    <p>Location</p>
                  </div>
                </div>
                </div>
              )
            }
          </div>


          <div className="border-t p-3">
            pagination
          </div>
        </div>

        </div>


    </div>
  )
}

export default ArticleTwo