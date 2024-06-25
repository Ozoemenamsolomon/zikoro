import React, { useState } from 'react'
import { format } from 'date-fns';
import { Booking } from '@/types/appointments';

interface SubmitType {
    formData: Booking; 
    setFormData: any
}

const SubmitBtn = ({formData, setFormData}: SubmitType) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isDisabled = !formData.appointmentDate || !formData.appointmentTime || !formData.appointmentLinkId || !formData.participantEmail
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/appointments/booking', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData, appointmentTime: format(new Date(formData.appointmentTime!), 'HH:mm:ss')}),
              });

              const result = await response.json();
  console.log({result})
            if (response.ok) {
                setFormData({
                    ...formData,
                    appointmentDate: null,
                    appointmentTime: null
                });
                console.log('Form submitted successfully', result);
                // push('/appointments/links')
            } else {
                console.error('Form submission failed', result);
                setError(result.error);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    
  return (
    <div className="w-full ">
        <button 
        onClick={handleSubmit} 
        type="button" 
        disabled={isDisabled!}
        className={` w-full px-4 p-3 rounded-md text-center 
        ${isDisabled ? 'bg-gray-200 text-gray-300 cursor-not-allowed':'bg-basePrimary  text-white  '} `}>
            {loading ? 'Submiting...': 'Book Appointment'}
        </button>
    </div>
  )
}

export default SubmitBtn