import { useGetBookingsAnalytics } from '@/hooks'
import React from 'react'
import SelectDuration from './SelectDuration'
import { BookingsChart } from './BookingsChart'
import { UserType } from '@/types/appointments'
import { getTypeLabel } from '@/lib/bookingsAnalytics'

const SectionThree = ({user}:{user:UserType}) => {
  const {type, setType,isLoading,error,current,previous,} = useGetBookingsAnalytics()

  return (
    <section className="w-full bg-white border rounded-lg p-6 ">
      <div className="space-y-">
        <h4 className="text-lg font-semibold">Bookings</h4>
        <p className="">Showing total bookings this {getTypeLabel(type)}</p>
      </div>
      <div className="flex w-full pt-2 justify-end gap-4 items-center">
        <p className="">Sort</p>
        <SelectDuration type={type} setType ={setType} />
      </div>
    <div className="mt-8 border bg-zikoroBlue/5 rounded-lg md:p-4 lg:p-8 ">
        <div className="min-h-96 md:p-4 lg:p-8 border bg-white rounded-lg">
            <BookingsChart type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
        </div>
    </div>
</section>
  )
}

export default SectionThree