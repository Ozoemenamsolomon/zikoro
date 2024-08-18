import React from 'react'
import SelectDuration from './SelectDuration'
import { TopClients } from './TopClientsTable'
import { useGetBookingsAnalytics } from '@/hooks'
import { UserType } from '@/types/appointments'
import { getTypeLabel } from '@/lib/bookingsAnalytics'

const SectionFour = ({user}:{user:UserType}) => {
  const {type, setType,isLoading,error,getBookings,current,previous,} = useGetBookingsAnalytics()

  return (
    <section className="p-8 rounded-lg bg-white border">
        <div className="">
        <h4 className="text-lg font-semibold">Top Clients</h4>
        <p>Your top participants this {getTypeLabel(type)}</p>
        </div>
        <div className="flex w-full pt-2 justify-end gap-4 items-center">
            <p className="">Sort</p>
            <SelectDuration type={type} setType ={setType} />
            </div>

        <div className="mt-8 mx-auto max-w-2xl bg-zikoroBlue/5 border p-4 rounded-lg ">
            <div className=" bg-white rounded-lg overflow-hidden w-fulll pb-8">
                <TopClients type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
            </div>
        </div>
    </section>
  )
}

export default SectionFour