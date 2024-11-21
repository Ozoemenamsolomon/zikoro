"use client";

import { cn } from "@/lib";
import { TAttendee, TEventTransactionDetail } from "@/types";
import { convertISOToFormattedDate } from "@/utils";
import { useMemo } from "react";

export function EventTransactionWidget({
  className,
  transaction,
}: {
  className?: string;
  transaction: TEventTransactionDetail;
}) {
  const date = useMemo(() => {
    return convertISOToFormattedDate(transaction?.created_at);
  }, [transaction]);

  const isEmailSent = useMemo(() => {
    if (transaction) {
      const { attendeesDetails }: { attendeesDetails: Partial<TAttendee>[] } =
        transaction;
      return attendeesDetails?.every((v: any) => {
        return v?.registrationCompleted === "true" || v?.registrationCompleted
      });
    }
  }, [transaction]);

  return (
    <tr
      className={cn(
        "w-full p-4 gap-2 grid grid-cols-11 items-center border-b",
        className
      )}
    >
      <td>{date}</td>
      <td className="col-span-2 w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {transaction?.userEmail ?? ""}
      </td>
      <td className="col-span-2 w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {transaction?.event ?? ""}
      </td>

      <td>{transaction?.attendees ?? "0"}</td>
      <td>
        {transaction?.currency}
        {transaction?.amountPayable ?? "0"}
      </td>
      <td>
        {transaction?.currency}
        {transaction?.amountPaid ?? "0"}
      </td>
      <td className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {transaction?.eventRegistrationRef ?? ""}
      </td>
      <td
        className={cn(
          "text-red-600 font-semibold text-xs sm:text-mobile",
          isEmailSent && "text-green-600"
        )}
      >
        {isEmailSent ? "success" : "failed"}
      </td>
      <td>
        <button className="text-basePrimary flex items-center gap-x-2 font-medium underline">
          Re-Send Email
        </button>
      </td>
    </tr>
  );
}
