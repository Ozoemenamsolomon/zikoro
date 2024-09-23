import { useEffect, useState } from "react";
import { useAppointmentContext } from "../context/AppointmentContext";
import Calender, { generateSlots, SlotsResult } from "../booking/Calender";
import { getEnabledTimeDetails } from "./Appointments";
import { XCircle, Calendar,  } from "lucide-react";
import { AntiClock, CancelX, EditPenIcon } from "@/constants";
import { format } from "date-fns";
import Slots from "../booking/Slots";
import toast from "react-hot-toast";
import { Booking } from "@/types/appointments";
import { generateAppointmentTime } from "../booking/submitBooking";
import { cn } from "@/lib";

export const Reschedule = ({ refresh }: { refresh: () => void }) => {
    const { bookingFormData, setBookingFormData, selectedItem } = useAppointmentContext();
    const [timeSlots, setTimeSlots] = useState<SlotsResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    // const [isSelected, setIsSelected] = useState<string>('');
    // console.log({bookingFormData})
    useEffect(() => {
      const fetchSlots = async () => {
        const getTimeSlots = await generateSlots(
          getEnabledTimeDetails(bookingFormData?.appointmentLinkId),
          bookingFormData?.appointmentLinkId?.duration!,
          bookingFormData?.appointmentLinkId?.sessionBreak || 1,
          new Date(bookingFormData?.appointmentDate!)
        );
        setTimeSlots(getTimeSlots);
      };
      fetchSlots();
    }, [bookingFormData]);
  
    const updatingFunc = (callback: () => void) => {
      callback()
    }
  
    return (
      <section
        onClick={() => setBookingFormData(null)}
        className={cn(
          `${
            bookingFormData?.type
              ? "animate-float-in block"
              : "translate-y-10 opacity-0 invisible "
          } z-50 transform fixed transition-all duration-300 inset-0 bg-slate-500/10 p-6 flex justify-center items-center`
        )}
      >
        {isLoading && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-black/10 z-40"
          ></div>
        )}
  
        {
          bookingFormData?.type === "reschedule" && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full text-center max-w-4xl bg-white rounded-md shadow-lg max-h-full p-6 sm:p-10 space-y-2 py-12 flex flex-col justify-center relative overflow-y-auto"
          >
            <XCircle
              onClick={() => setBookingFormData(null)}
              size={20}
              className="absolute right-6 top-6 text-slate-500"
            />
            <div className="flex justify-center w-full">
              <AntiClock />
            </div>
  
            <h5 className="text-xl font-medium text-basePrimary">
              Reschedule Appointment
            </h5>
            <p className="text-[12px] max-w-xl mx-auto">
                {`You are about to reschedule this appointment ${bookingFormData?.firstName} ${bookingFormData?.lastName} ${bookingFormData?.timeStr}. Location: ${bookingFormData?.appointmentLinkId?.locationDetails}`}
            </p>
  
            {error && <p className="text-center text-[12px] text-red-600 pb-1 max-w-xl mx-auto">{error}</p>}
  
            <div className="flex justify-center items-center gap-2 font-semibold">
              <p>
                {format(
                  new Date(bookingFormData?.appointmentDate!),
                  "EEEE, d MMM. yyyy"
                )}
              </p>
              <Calendar size={20} className="text-slate-500" />
            </div>
  
            <div className="h-[28rem]  border hide-scrollbar overflow-auto w-full  rounded-lg ">
                {/* <h6 className="font-semibold">Choose time</h6> */}
                {/* <Slots
                    appointmnetLink={bookingFormData?.appointmentLinkId}
                    timeSlots={timeSlots}
                    selectedDate={new Date(selectedItem)}
                /> */}
                <Calender appointmnetLink={bookingFormData?.appointmentLinkId}/> 
            </div>

            <div className="w-full flex items-center gap-1">
              <EditPenIcon />
              <input
                type="text"
                id="reason"
                name="reason"
                onChange={(e) => {
                  setBookingFormData({
                    ...bookingFormData,
                    reason: e.target.value,
                  });
                  setError("");
                }}
                placeholder="Add notes to let invitees know why you rescheduled"
                className={`${
                  error ? "border-red-600 " : ""
                } p-2 border bg-transparent focus:outline-none rounded-md focus:bg-transaparent text-slate-700 w-full placeholder:text-[12px]`}
              />
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={() =>
                  reschedule(
                    bookingFormData,
                    refresh,
                    setBookingFormData,
                    setIsLoading,
                    setError
                  )
                }
                className="bg-basePrimary rounded-md text-white font-medium py-2 px-6 w-full flex justify-center"
              >
                {isLoading ? "Submiting..." : "Reschedule Appointment"}
              </button>
            </div>
          </div>
        )}
  
        {bookingFormData?.type === "cancel" && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full text-center sm:w-[28rem] bg-white rounded-md shadow-lg max-h-full p-6 sm:p-10 space-y-4 py-12 flex flex-col justify-center relative overflow-y-auto"
          >
            <XCircle
              onClick={() => setBookingFormData(null)}
              size={20}
              className="absolute right-6 top-6 text-slate-500 cursor-pointer"
            />
            <div className="flex justify-center w-full">
              <CancelX />
            </div>
            <h5 className="text-xl font-medium text-red-600">
              Cancel Appointment
            </h5>
            <p className="text-[12px]">{`You are about to cancel this appointment ${bookingFormData?.firstName} ${bookingFormData?.lastName} ${bookingFormData?.timeStr}. Location: ${bookingFormData?.appointmentLinkId?.locationDetails}`}</p>
            {error && <p className="text-center text-red-600 pb-1">{error}</p>}
  
            <div className="w-full pt-8 flex items-center gap-1">
              <EditPenIcon />
              <input
                type="text"
                id="reason"
                name="reason"
                onChange={(e) => {
                  setBookingFormData({
                    ...bookingFormData,
                    reason: e.target.value,
                  });
                  setError("");
                }}
                placeholder="Add notes to let invitees know why you canceled"
                className={`${
                  error ? "border-red-600 " : ""
                } p-2 border bg-transparent focus:outline-none rounded-md focus:bg-transaparent text-slate-700 w-full placeholder:text-[12px]`}
              />
            </div>
  
            <div className="flex justify-center w-full">
              <button
                onClick={() =>
                  cancelSchedule(
                    bookingFormData,
                    refresh,
                    setBookingFormData,
                    setIsLoading,
                    setError
                  )
                }
                className="bg-red-600 rounded-md text-white font-medium py-2 px-6"
              >
                {isLoading ? "Submiting..." : "Cancel Appointment"}
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  const reschedule = async (
    bookingFormData: Booking,
    refresh: any,
    setBookingFormData: any,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: (state: string) => void
  ) => {
    // console.log({ bookingFormData });
    setError("");
  
    const timeStamp = generateAppointmentTime({
      timeRange: bookingFormData?.appointmentTime!,
      selectedDate: bookingFormData?.appointmentDate!,
    });
  
    // if(!bookingFormData?.reason){
    //   setError('Provide a reason.')
    //   return
    // }
  
    try {
      setIsLoading(true);
      const res = await fetch("/api/email/send-rescheduling-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingFormData: { ...bookingFormData, appointmentTime: timeStamp },
        }),
      });
      if (res.ok) {
        toast.success("Successfully, email reminder sent");
        refresh();
        setBookingFormData(null);
      } else {
        toast.error("Unsuccessfull");
        setError("Error rescheduling appointment");
      }
    } catch (error) {
      toast.error("Server error.");
      setError("Server error.");
      // console.log('Error from server', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const cancelSchedule = async (
    bookingFormData: Booking,
    refresh: any,
    setBookingFormData: any,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: (state: string) => void
  ) => {
    // console.log({ bookingFormData });
  
    setError("");
  
    const timeStamp = generateAppointmentTime({
      timeRange: bookingFormData?.appointmentTime!,
      selectedDate: bookingFormData?.appointmentDate!,
    });
  
    // if(!bookingFormData?.reason){
    //   setError('Provide a reason.')
    // }
  
    try {
      setIsLoading(true);
      const res = await fetch("/api/email/send-cancelSchedule-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingFormData: { ...bookingFormData, appointmentTime: timeStamp },
        }),
      });
  
      if (res.ok) {
        // console.log('Successfully cancelled appointment, email reminder sent', await res.json());
        toast.success("Successfull, email sent.");
        refresh();
        setBookingFormData();
      } else {
        toast.error("Unsuccessful");
        setError("Error rescheduling appointment");
        // console.log('Error cancelled appointment', await res.json());
      }
    } catch (error) {
      setError("Server error.");
      // console.log('Error from server', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  