import React, { useState } from 'react'
import { useAppointmentContext } from '../context/AppointmentContext'
import { ArrowLeft } from 'lucide-react'
import { BentArrowLeft } from '@/constants'
import { usePaystackPayment } from 'react-paystack'

const ProcessPayment = () => {
  const [loading, setLoading] = useState(false)
  const [paymentRefId, setPaymentRefId] = useState('')
  let isDisabled

  const {bookingFormData,setIsFormUp } = useAppointmentContext()

  // payment data
  const config:any = {
		email: bookingFormData?.email,
		amount: Number(bookingFormData?.price) * 100,
		publicKey: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY,
    firstName: bookingFormData?.firstName,
    lastName: bookingFormData?.lastName,
    phone: bookingFormData?.phone,
    metadata:{
      firstName: bookingFormData?.firstName,
      lastName: bookingFormData?.lastName,
      phone: bookingFormData?.phone,
      appointmentType: bookingFormData?.appointmentType,
  }
	};

  const handleSuccessfulPayment = () => {
    // verify reference and add payment to table and print receipt.
    return
  }

  const onSuccess = (reference) => {
    console.log({reference})
		setPaymentRefId(reference?.reference!)
    handleSuccessfulPayment()
	};

  const onClose = () => {
    console.log('You cancelled your payment')
	};

  // TODO: Paystack
  const initializePayment = usePaystackPayment(config);

	const handlePaymnet = async () => {
		try {
			initializePayment(onSuccess, onClose! );
		} catch (error) {
			console.error('catch error==', error);
		}
	};
  
  return (
    <section className='absolute inset-0 flex justify-center items-center p-6'>
      <div onClick={()=>setIsFormUp('')} className="absolute top-24 left-6 bg-slate-100 rounded-full h-12 w-12 flex justify-center items-center">
        <BentArrowLeft w={20} h={20}/>
      </div>
      <div className="w-full max-w-sm bg-white rounded-xl  shadow-lg p-6 py-24 flex flex-col items-center gap-6">
        <h4 className="text-xl font-medium text-center">Order Summary</h4>

        <div className="p-6 w-full rounded-xl shadow border border-zikoroBlue">
          <h5 className="text-lg font-medium pb-2 border-b mb-6">Orders</h5>
          <div className="space-y-2">
            <div className="flex w-full justify-between gap-6">
              <p className="">{bookingFormData?.appointmentType || bookingFormData?.appointmentName}</p>
              <p className="">{bookingFormData?.currency}{bookingFormData?.price}</p>
            </div>
            <div className="flex w-full justify-between gap-6">
              <p className="">Total</p>
              <p className="">{bookingFormData?.currency}{ bookingFormData?.price}</p>
            </div>
          </div>
        </div>

        <button type="button" onClick={handlePaymnet}
        className={`w-full py-2 px-4 bg-basePrimary text-white rounded ${loading  || isDisabled ? ' cursor-not-allowed opacity-30' : ''}`}
        disabled={loading || isDisabled}
        >{bookingFormData?.currency}{ bookingFormData?.price}</button>

      </div>
      
    </section>
  )
}

export default ProcessPayment