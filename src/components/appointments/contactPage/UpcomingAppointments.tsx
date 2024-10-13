'use client'

import useUserStore from '@/store/globalUserStore'
import { BookingsContact } from '@/types/appointments'
import { createClient } from '@/utils/supabase/client'
import { format, startOfToday } from 'date-fns'
import React, { useEffect, useState } from 'react'
import PaginationMain from '../shared/PaginationMain'
import { Loader2Icon } from 'lucide-react'

const UpcomingAppointments = ({ contact }: { contact: BookingsContact }) => {
  const { user } = useUserStore()
  const [bookings, setBookings] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 5
  const today = startOfToday().toISOString()

  const fetchAppointments = async (page: number = 1) => {
    const supabase = createClient()
    try {
      setIsError('')
      setLoading(true)
      const offset = (page - 1) * limit

      let query = supabase
        .from('bookings')
        .select(
          'id, created_at, appointmentDuration, appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId(locationDetails)', 
          { count: 'exact' }
        )
        .eq('createdBy', user?.id)
        .eq('participantEmail', contact?.email)
        .gte('appointmentDate', today)
        .range(offset, offset + limit - 1)
        .order('appointmentDate', { ascending: false })

      const { data, count, error } = await query

      if (error) {
        console.error('Error fetching appointments:', error)
        setIsError('Failed to fetch appointments. Please try again later.')
        return
      }

      setBookings(data || [])
      setTotalPages(Math.ceil((count || 0) / limit))
    } catch (error) {
      console.error('Server error:', error)
      setIsError('Server error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (contact) {
      fetchAppointments(currentPage)
    }
  }, [contact,])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchAppointments(page)
  }

  return (
    <section className="flex flex-col gap-3 w-full p-3">
      {loading ? (
        <p className="flex justify-center w-full text-basePrimary/50 py-6"><Loader2Icon size={18} className='animate-spin'/></p>
      ) : isError ? (
        <p className="text-center text-red-500">{isError}</p>
      ) : bookings.length ? (
        <>
          {bookings.map((item, idx) => {
            const { appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId } = item

            return (
              <div key={idx} className="flex gap-3 border-b pb-3">
                <div className="rounded-md text-center overflow-hidden border shrink-0 w-20">
                  <div className="p-1 w-full bg-baseBg text-sm shrink-0 overflow-clip">
                    {format(new Date(appointmentDate), 'MMMM')}
                  </div>
                  <div className="p-2 border-t text-base font-semibold">
                    {format(new Date(appointmentDate), 'd')}
                  </div>
                </div>
                <div className="w-full">
                  <p className="font-medium">{appointmentName}</p>
                  <p>{appointmentTimeStr}</p>
                  <p className='text-[12px]'>{appointmentLinkId?.locationDetails || 'No location details'}</p>
                </div>
              </div>
            )
          })}
          <div className="flex justify-center py-2">
            <PaginationMain
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 pb-4">No previous appointments</p>
      )}
    </section>
  )
}

export default UpcomingAppointments
