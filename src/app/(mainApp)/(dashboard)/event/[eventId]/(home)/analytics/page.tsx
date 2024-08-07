"use client";
import { attendeeTypeOptions } from "@/data/attendee";
import { useGetAttendees, useGetEventTransactions } from "@/hooks";
import TargetIcon from "@/public/icons/Target";
import UsersIcon from "@/public/icons/Users";
import useEventStore from "@/store/globalEventStore";
import { COUNTRY_CODE, formatNumberToShortHand } from "@/utils";
import { BarChart, LineChart, lineElementClasses } from "@mui/x-charts";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { useParams } from "next/navigation";
import React, { ReactNode } from "react";
import { AccountBalanceWallet } from "styled-icons/material";

export const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: "Jan",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: "Feb",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: "Mar",
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: "Apr",
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: "May",
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: "June",
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: "July",
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: "Aug",
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: "Sept",
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: "Oct",
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: "Nov",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: "Dec",
  },
];

const valueFormatter = (value: number | null) => `${value}mm`;

const AnalyticsInfoCard = ({
  label,
  Icon,
  value,
}: {
  Icon: (props: any) => React.JSX.Element;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="p-4 rounded-md bg-white border flex items-center">
      <div className="flex items-center justify-center flex-[30%]">
        <div className="bg-basePrimary/20 p-4 rounded-full h-fit w-fit">
          <Icon className="h-10 w-10 text-basePrimary" />
        </div>
      </div>
      <div className="flex-[70%] flex flex-col gap-2">
        <h3 className="font-medium text-gray-600 capitalize">{label}</h3>
        <h4 className="text-4xl font-medium text-gray-800">{value}</h4>
      </div>
    </div>
  );
};

const page = () => {
  const { eventId } = useParams();

  const {
    attendees,
    isLoading: attendeesIsLoading,
    getAttendees,
  } = useGetAttendees({ eventId });
  const {
    eventTransactions,
    isLoading: eventTransactionsIsLoading,
    getEventTransactions,
  } = useGetEventTransactions({
    eventId,
  });
  const { event } = useEventStore();

  console.log(attendees[0]);
  console.log(eventTransactions);

  const revenueTarget =
    event?.pricing.reduce(
      (acc, { price, ticketQuantity }) =>
        acc + parseInt(price) * parseInt(ticketQuantity),
      0
    ) ?? 0;
  const revenue = eventTransactions.reduce(
    (acc, { amountPaid }) => (amountPaid || 0) + acc,
    0
  );
  const registrationTarget = event?.expectedParticipants ?? 0;
  const registrations = attendees.length;
  const totalDiscountAmount = eventTransactions.reduce(
    (acc, { discountValue }) => acc + (discountValue ?? 0),
    0
  );
  const discountPercentage =
    (eventTransactions.filter(({ discountCode }) => discountCode).length /
      eventTransactions.length) *
    100;
  const registrationViaReferrals = 20;
  const revenueViaReferrals = "52%";
  const eventStartDateToNow = eachDayOfInterval({
    start: event?.startDateTime ?? new Date(),
    end: new Date(),
  });

  const registeredByDate = eventStartDateToNow.map((date) =>
    attendees.reduce(
      (acc, { registrationDate }) =>
        isSameDay(date, registrationDate) ? acc + 1 : acc,
      0
    )
  );
  const attendeeTypes = attendeeTypeOptions.map((option) => option.value);
  const attendeeCounts = attendeeTypes.map((type) =>
    attendees.reduce(
      (count, attendee) =>
        count + (attendee.attendeeType.includes(type) ? 1 : 0),
      0
    )
  );
  const maxCount = Math.max(...attendeeCounts);
  const attendeeOffsets = attendeeCounts.map((count) => maxCount - count);
  const uniqueCountries = [
    ...new Set(attendees.map((attendee) => attendee.country || "Unknown")),
  ];

  const countryCounts = uniqueCountries
    .map((country) => ({
      name: country,
      count: attendees.reduce(
        (count, attendee) =>
          count + ((attendee.country || "Unknown") === country ? 1 : 0),
        0
      ),
      code: COUNTRY_CODE.find(({ name }) => name === country)?.code,
    }))
    .sort((a, b) => b.count - a.count);

  const ticketSales = event?.pricing.map(({ attendeeType, price }) => ({
    name: attendeeType,
    price,
    quantity: attendees.filter(({ ticketType }) => attendeeType === ticketType)
      .length,
  }));

  return (
    <section className="py-8 px-2 md:px-6 lg:px-12 bg-basePrimary/5 space-y-12">
      <section className="bg-basePrimary/10 py-4 px-4 md:pl-4 md:pr-12 rounded-md flex items-center gap-8">
        <div className="bg-white/70 text-basePrimary rounded-full p-2 h-fit w-fit">
          <TargetIcon className="h-10 w-10" />
        </div>
        <div className="space-y-4 flex-1">
          <h2 className="text-basePrimary font-medium text-lg">Goals</h2>
          <div className="flex flex-col md:flex-row justify-evenly gap-6">
            <div className="bg-white/70 p-2 rounded-md space-y-2 flex-1">
              <div className="flex gap-2 items-center">
                <AccountBalanceWallet className="w-5 h-5 text-basePrimary" />
                <span className="text-gray-600 font-medium">Revenue</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600 text-sm">
                  {formatNumberToShortHand(revenue)}
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-600 text-sm">Target:</span>
                  <span className="text-gray-800">
                    {formatNumberToShortHand(revenueTarget)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-basePrimary/20 rounded-2xl h-4">
                <div
                  style={{ width: (revenue / revenueTarget) * 100 + "%" }}
                  className="h-full bg-basePrimary rounded-2xl transition-all"
                />
              </div>
            </div>
            <div className="bg-white/70 p-2 rounded-md space-y-2 flex-1">
              <div className="flex gap-2 items-center">
                <AccountBalanceWallet className="w-5 h-5 text-basePrimary" />
                <span className="text-gray-600 font-medium">Registrations</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600 text-sm">{registrations}</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-600 text-sm">Target:</span>
                  <span className="text-gray-800">{registrationTarget}</span>
                </div>
              </div>
              <div className="w-full bg-basePrimary/20 rounded-2xl h-4">
                <div
                  style={{
                    width: (registrations / registrationTarget) * 100 + "%",
                  }}
                  className="h-full bg-basePrimary rounded-2xl transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-12">
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Total registrations"}
          value={registrations}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Revenue"}
          value={formatNumberToShortHand(revenue)}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Discount Value"}
          value={totalDiscountAmount}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Registrations via referrals"}
          value={registrationViaReferrals}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"% Referrals via referrals"}
          value={revenueViaReferrals}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Returning Attendees"}
          value={"12"}
        />
      </section>
      <section className="bg-white p-4 space-y-4 rounded-md border">
        <h2 className="text-gray-600 font-medium text-sm">
          Daily Registrations
        </h2>
        <LineChart
          colors={["#001FCC"]}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              display: "none",
            },
            "& .MuiAreaElement-series-yaxis": {
              fill: "url('#lineGradient')",
            },
          }}
          xAxis={[
            {
              data: eventStartDateToNow,
              scaleType: "time",
              valueFormatter: (date) => format(date, "dd/MM/yyyy"),
            },
          ]}
          series={[
            {
              id: "yaxis",
              data: registeredByDate,
              area: true,
              showMark: false,
            },
          ]}
          height={300}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
          //   grid={{ vertical: true, horizontal: true }}
        >
          <defs>
            <linearGradient
              id="lineGradient"
              // gradientTransform="rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                // offset="5%"
                style={{ stopColor: "#001FCC80", stopOpacity: 1 }}
              >
                <stop
                  // offset="50%"
                  style={{ stopColor: "#ffffff", stopOpacity: 1 }}
                ></stop>
              </stop>
            </linearGradient>
          </defs>
        </LineChart>
      </section>
      <section className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-4 space-y-4 border rounded-md">
          <h2 className="text-gray-600 font-medium text-sm">
            Registrations By Attendee Type
          </h2>

          <BarChart
            yAxis={[
              {
                scaleType: "band",
                data: attendeeTypes,
                categoryGapRatio: 0.5,
                barGapRatio: 0.5,
              },
            ]}
            series={[
              { data: attendeeCounts, stack: "total", color: "#001FCC" },
              { data: attendeeOffsets, stack: "total", color: "#001FCC33" },
            ]}
            xAxis={[{ tickMinStep: 1 }]}
            layout="horizontal"
            grid={{ vertical: true }}
            margin={{ left: 100, top: 5 }}
            leftAxis={{ disableLine: true, disableTicks: true }}
            bottomAxis={{ disableLine: true, tickSize: 10 }}
            borderRadius={20}
            height={400}
            xAxis={[{ tickMinStep: 1 }]}
          />
        </section>
        <section className="bg-white p-4 space-y-4 border rounded-md">
          <h2 className="text-gray-600 font-medium text-sm">
            Attendees By Country
          </h2>
          <div className="flex flex-col gap-2">
            {countryCounts.map(({ code, count, name }) => (
              <div className="flex items-center gap-4">
                {code ? (
                  <img
                    src={`https://flagsapi.com/${code}/shiny/32.png`}
                    title={name + " flag"}
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-500" />
                )}
                <div className="truncate text-gray-700 font-medium capitalize flex-1">
                  {name}
                </div>
                <span className="text-gray-900 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">
          Sales by Ticket Type
        </h2>
        <table className="border rounded-md w-full">
          <thead className="w-full">
            <tr className="flex bg-basePrimary/10 p-4 text-gray-600 font-medium">
              <td className="flex-[30%]">Ticket Name</td>
              <td className="flex-[25%]">Price</td>
              <td className="flex-[20%]">No Bought</td>
              <td className="flex-[25%]">Revenue</td>
            </tr>
          </thead>
          <tbody className="[&>*:not(:last-child)]:border-b w-full font-medium">
            {ticketSales &&
              ticketSales.map(({ name, price, quantity }) => (
                <tr className="flex p-4 text-gray-800">
                  <td className="flex-[30%]">{name}</td>
                  <td className="flex-[25%]">{price}</td>
                  <td className="flex-[20%]">{quantity}</td>
                  <td className="flex-[25%]">{parseInt(price) * quantity}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default page;
