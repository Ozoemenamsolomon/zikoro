import React, { useCallback, useState } from 'react'
import { useAppointmentContext } from '../context/AppointmentContext'
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react'
import { BentArrowLeft } from '@/constants'
import { usePaystackPayment } from 'react-paystack'
import { usePathname } from 'next/navigation'
import { submitBooking } from './submitBooking'
import { AppointmentLink } from '@/types/appointments'
import { error } from 'console'

const ProcessPayment = ({appointmentLink}:{appointmentLink:AppointmentLink | null}) => {
  // console.log({appointmentLink})
  const [loading, setLoading] = useState(false)
  const [paymentRefId, setPaymentRefId] = useState('')
  let isDisabled
  const [status, setStatus] = useState('')
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {bookingFormData, isFormUp, setIsFormUp, setBookingFormData, slotCounts, setSlotCounts,setInactiveSlots,} = useAppointmentContext()
  const maxBookingLimit = appointmentLink?.maxBooking!;

    const pathname = usePathname()
  // payment data
  const config:any = {
		email: bookingFormData?.participantEmail,
		amount: Number(bookingFormData?.price) * 100,
		publicKey: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY,
    firstName: bookingFormData?.firstName,
    lastName: bookingFormData?.lastName,
    phone: bookingFormData?.phone,
    metadata:{
     bookingFormData
  }
	};
console.log({status})
  const handleSuccessfulPayment = async (reference: string) => {
    try {
      setStatus('verifying');
      
      const verifyResponse = await fetch(`/api/appointments/payments/paystack/verify?ref=${encodeURIComponent(reference)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });
  
      const res = await verifyResponse.json();
  
      if (res && res.success) {
        setStatus("sending_emails");
        // if(status==="sending_emails") {
          console.log('VERIFIED, BOOKING AND SENDING EMAILS')
          const { bookingSuccess, emailSuccess } = await submitBooking({
            setLoading,
            setErrors,
            bookingFormData,
            setBookingFormData,
            slotCounts,
            setSlotCounts,
            setInactiveSlots,
            setSuccess,
            maxBookingLimit,
            appointmentLink,
            pathname,
          });
          if (bookingSuccess && emailSuccess) {
          console.log('SUCCESSFUL,')
  
            setStatus('successful');
          } else if (bookingSuccess && !emailSuccess) {
            setStatus('email_failed');
          console.log('EMAIL NOT SUCCESSFUL')
  
          } else {
          console.log('ERRORS')
  
            setStatus('errors');
          }
        // } 
      } else {
        setStatus('unverified');
      }
    } catch (error) {
      console.error('Error in handleSuccessfulPayment:', error);
      setStatus('errors');
      setErrors((prev) => ({ ...prev, general: 'An unexpected error occurred during payment verification.' }));
    }
  };

  const onSuccess = (reference:{[key:string]:string}) => {
		setPaymentRefId(reference?.reference!)
    handleSuccessfulPayment(reference?.reference)
	};

  const onClose = () => {
    console.log('You cancelled your payment')
	};

  // TODO: Paystack
  const initializePayment = usePaystackPayment(config);

	const handlePaymnet = async () => {
		try {
			initializePayment({onSuccess, onClose});
		} catch (error) {
			console.error('catch error==', error);
		}
	};
  
  return (
    <section className='absolute inset-0 flex justify-center items-center p-6'>
      <div onClick={()=>{
        setIsFormUp('')
        setStatus('')
        }} 
        className="absolute top-24 left-6 bg-slate-100 rounded-full h-12 w-12 flex justify-center items-center">
        <BentArrowLeft w={20} h={20}/>
      </div>

      {
        status ?
        <div className="w-80 h-80 mx-auto bg-white rounded-xl  shadow-lg p-8 py-24 flex flex-col items-center justify-center text-center gap-6">
            {
              status==='verifying' ?
              <div className="flex flex-col items-center justify-center gap-1">
                <Loader size={24} className='animate-spin text-zikoroBlue '/>
                <p className='font-bold'>Verifying payment</p>
              </div>
              : 
              status==='unverified' ?
              // error verification...
              <div className="flex flex-col items-center justify-center gap-1">
                <XCircle size={60} className='p-3 rounded-full text-purple-600  ' />
                <h4 className='font-semibold text-lg'>Payment was not verified!</h4>
                <p>Contact support team if you were debited.</p>
              </div> 
              :
              status==="sending_emails" ?
              <div className="flex flex-col items-center justify-center gap-1">
                <Loader size={24} className='animate-spin text-zikoroBlue '/>
                <h4 className='font-semibold text-lg'>Payment verified</h4>
                <p>Sending Emails...</p>
              </div>  
              :
              status==='successful' ?
              <div className="flex flex-col items-center justify-center gap-1">
                <CheckCircle size={60} className='p-3 rounded-full bg-basePrimary text-white'/>
                <h4 className='font-semibold text-lg text-basePrimary'>Payment Successfull!</h4>
                <p>{success}</p>
              </div> 
              :
              status==='email_failed' ?
              <div className="flex flex-col items-center justify-center gap-1">
                <CheckCircle size={60} className='p-3 rounded-full bg-basePrimary text-white'/>
                <h4 className='font-semibold text-lg text-basePrimary'>Payment Successfull!</h4>
                <p>{success}</p>
              </div> 
              :
              status==='errors' ?
              <div className="flex flex-col items-center justify-center gap-1">
                <XCircle size={60} className='p-3 rounded-full bg-red-600 text-white' />
                <h4 className='font-semibold text-lg text-red-600'>Error!</h4>
                <p className='font-'>Payment Successfull!</p>
                <p className='font-semibold'>{errors.general}</p>
              </div>
              :
              <></>
            }
        </div>
        :
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
      }
      
    </section>
  )
}

export default ProcessPayment