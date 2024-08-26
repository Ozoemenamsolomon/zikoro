import { useGetBookingsAnalytics } from '@/hooks'
import React from 'react'
import SelectDuration from './SelectDuration'
import { UserType } from '@/types/appointments'
import { getTypeLabel } from '@/lib/bookingsAnalytics'
import { EarningsBarChart } from './EarningsBarChart'
import { TUser } from '@/types'
const SectionFive = ({user}:{user:TUser}) => {
  const {type, setType,isLoading,error,getBookings,current,previous,getYearlyBooking} = useGetBookingsAnalytics(user)

  return (
    <section className="w-full bg-white border rounded-lg p-6 ">
      <div className="space-y-">
        <h4 className="text-lg font-semibold">Earnings</h4>
        <p className="">Showing total earnings comparison for the selected period.
        </p>
      </div>
      <div className="flex w-full pt-2 justify-end gap-4 items-center">
        <p className="">Sort</p>
        <SelectDuration type={type} setType ={setType} />
      </div>
    <div className="mt-8 border bg-zikoroBlue/5 rounded-lg md:p-4 lg:p-8 ">
        <div className="min-h-96 md:p-4 lg:p-8 border bg-white rounded-lg">
            <EarningsBarChart type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
        </div>
    </div>
</section>
  )
}

export default SectionFive