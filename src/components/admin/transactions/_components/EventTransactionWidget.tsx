"use client";

import { usePostRequest } from "@/hooks/services/request";
import { cn } from "@/lib";
import { TAttendee, TEventTransactionDetail, TOrgEvent } from "@/types";
import { convertISOToFormattedDate, formatDate } from "@/utils";
import { useMemo } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";

interface Transactions extends TEventTransactionDetail {
  eventData: TOrgEvent;
}

export function EventTransactionWidget({
  className,
  transaction,
  transactionIds,
  updateTransactionIds,
  getTransactions
}: {
  className?: string;
  transaction: Transactions;
  updateTransactionIds(id: number): void
  transactionIds: number[];
  getTransactions:() => Promise<any>

}) {
  const { postData, isLoading } = usePostRequest("/payment/resend");

  const date = useMemo(() => {
    return convertISOToFormattedDate(transaction?.created_at);
  }, [transaction]);

  const isEmailSent = useMemo(() => {
    if (transaction) {
  

      return transaction?.emailSent === null ? true : transaction?.emailSent
    }
  }, [transaction]);

  const isRegCompleted = useMemo(() => {
   if (transaction) {
    const { attendeesDetails }: { attendeesDetails: Partial<TAttendee>[] } =
    transaction;
  return attendeesDetails?.every((v: any) => {
    return (
      v?.registrationCompleted === "true" ||
      v?.registrationCompleted === true
    );
  });
   }
  },[transaction])

  async function onResend() {
    const payload = {
      eventId: transaction?.eventId,
      eventAlias: transaction?.eventAlias,
      eventImage: transaction?.eventData?.eventPoster,
      eventRegistrationRef: transaction?.eventRegistrationRef,
      amountPaid: transaction?.amountPaid,
      attendees: transaction?.attendees,
      discountValue: transaction?.discountValue,
      referralSource: transaction?.referralSource,
      discountCode: transaction?.discountCode,
      amountPayable: transaction?.amountPayable,

      address: transaction?.eventData?.eventAddress,
      count: transaction?.attendees,
      currency: transaction?.currency,
      organizerContact: {
        email: transaction?.eventData?.organization?.eventContactEmail,

        phoneNumber: transaction?.eventData?.organization?.eventPhoneNumber,
        whatsappNumber: transaction?.eventData?.organization?.eventWhatsApp,
      },
      organization: transaction?.eventData?.organization?.organizationName,
      startDate: formatDate(transaction?.eventData?.startDateTime),
      endDate: formatDate(transaction?.eventData?.endDateTime),
      paymentDate: transaction?.paymentDate,
      eventDate: transaction?.eventDate,
      eventEndDate: transaction?.eventData?.endDateTime,
      event: transaction?.event,
      attendeesDetails: transaction?.attendeesDetails,
      eventPrice: transaction?.eventPrice,
      originalEvent: transaction?.eventData,
    };

    await postData({ payload });
    getTransactions()
  }

  return (
    <tr
      className={cn(
        "w-full p-4 gap-2 grid grid-cols-9 items-center border-b",
        className
      )}
    >
      <td>
        
        <label className="w-full flex items-center gap-x-2">
        <input
            checked={transactionIds.includes(transaction?.id)}
            onChange={() => updateTransactionIds(transaction?.id)}
            type="checkbox"
            className="accent-basePrimary w-4 h-4"
          />
          <span>{date}</span>
        </label>
        </td>
        <td className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {transaction?.eventRegistrationRef ?? ""}
      </td>
      <td className="col-span-2 w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {transaction?.event ?? ""}
      </td>

      <td>{transaction?.attendees ?? "0"}</td>
     
      <td>
        {transaction?.currency}
        {transaction?.amountPaid ?? "0"}
      </td>
  
      <td
        className={cn(
          "bg-red-600 text-white p-1 w-fit flex items-center justify-center  rounded-sm font-semibold text-xs sm:text-mobile",
          transaction?.registrationCompleted && "bg-green-600"
        )}
      >
        {transaction?.registrationCompleted ? "success" : "failed"}
      </td>
      <td
        className={cn(
          "text-white p-1 bg-red-600 w-fit flex items-center justify-center font-semibold text-xs sm:text-mobile",
          isEmailSent && "bg-green-600"
        )}
      >
        {isEmailSent ? "success" : "failed"}
      </td>
      <td>
        <button
          onClick={onResend}
          disabled={isLoading}
          className="text-basePrimary flex items-center gap-x-2 font-medium underline"
        >
          Re-Send Email
          {isLoading && <LoaderAlt size={18} className="text-gray-600" />}
        </button>
      </td>
    </tr>
  );
}
