import React, { useEffect, useState } from 'react'
import SelectDuration from './SelectDuration'
import { DoughnutChart } from './DoughnutChart'
import { AppointmentTable } from './AppointmentTable'
import { useGetBookingsAnalytics } from '@/hooks'
import { generateKPIData, KPIData } from '@/lib/bookingsAnalytics'
import { TUser } from '@/types'

const SectionTwo = ({user}:{user:TUser}) => {
    const [tableData, setTableData] = useState<KPIData[]>([])

    const {type, setType,isLoading,error, current,previous,} = useGetBookingsAnalytics()

    useEffect(() => {
        setTableData(generateKPIData(current,previous))
    }, [current])
    
console.log({current,previous,})
  return (
    <div className="  p-4 py-8 rounded-lg bg-white border">
        <header className="">
            <h4 className="text-lg font-semibold pb-2">Appointment type</h4>
            <div className="flex w-full justify-end gap-4 items-center">
                <p className="">Sort</p>
                <SelectDuration type={type} setType ={setType} />
            </div>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-1 ">
            <div className=" ">
                <DoughnutChart tableData={tableData} isLoading={isLoading} error={error!}/>
            </div>
            <div className="pt-3">
                <AppointmentTable tableData={tableData} isLoading={isLoading} error={error!}/>
            </div>
        </div>
    </div>
  )
}

export default SectionTwo