import Main from "@/components/appointments/Main";
import React from "react";
import Calender from "@/components/appointments/calender/Calender";

export const dynamic = "force-dynamic";
interface SearchParams {
  viewing: "month" | "week";
  date: Date;
}

const CalenderPage: React.FC<{ searchParams: SearchParams }> = async ({
  searchParams: { viewing, date },
}) => {
  return <Calender viewing={viewing} date={date} />;
};

export default CalenderPage;
