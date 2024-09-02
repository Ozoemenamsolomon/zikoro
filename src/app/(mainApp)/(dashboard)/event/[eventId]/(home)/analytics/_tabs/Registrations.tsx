"use client";
import { attendeeTypeOptions } from "@/data/attendee";
import {
  useGetAffiliateLinks,
  useGetAttendees,
  useGetEventTransactions,
} from "@/hooks";
import TargetIcon from "@/public/icons/Target";
import useEventStore from "@/store/globalEventStore";
import { COUNTRY_CODE, formatNumberToShortHand } from "@/utils";
import { BarChart, LineChart, lineElementClasses } from "@mui/x-charts";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  startOfDay,
  endOfWeek,
  startOfWeek,
  endOfMonth,
  startOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  differenceInMilliseconds,
} from "date-fns";
import { useParams } from "next/navigation";
import React, { ReactNode, useMemo, useState } from "react";
import wallet from "@/public/icons/wallet.svg";
import people from "@/public/icons/people.svg";
import discountTag from "@/public/icons/discount_tag.svg";
import peopleAdd from "@/public/icons/people_add.svg";
import peopleSync from "@/public/icons/people_sync.svg";
import moneyUp from "@/public/icons/money_up.svg";
import { cn } from "@/lib";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { useGetData } from "@/hooks/services/request";
import { AnalyticsInfoCard } from "../page";

const Registrations = () => {
  const { eventId }: { eventId: string } = useParams();
  const { organization } = useOrganizationStore();

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
  const { affiliateLinks } = useGetAffiliateLinks({ eventId, isUsed: true });
  console.log(affiliateLinks);

  const { data: recurringData, isLoading: recurringIsLoading } = useGetData(
    `/events/${eventId}/analytics/recurring?organizationId=${organization?.id}`
  );
  const { event } = useEventStore();

  const timeDivisions = ["daily", "weekly", "monthly"];
  const [displayLineChart, setDisplayLineChart] = useState<
    "daily" | "monthly" | "weekly"
  >("daily");

  console.log(recurringData);

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
  const totalDiscountRegistrations = eventTransactions.reduce(
    (acc, { attendees, discountValue }) =>
      acc + (discountValue && discountValue > 0 ? attendees : 0),
    0
  );
  const discountPercentage =
    (eventTransactions.filter(({ discountCode }) => discountCode).length /
      eventTransactions.length) *
    100;
  console.log(eventTransactions.filter(({ id }) => id === 706));
  const registrationViaReferrals = eventTransactions
    .filter(({ affiliateCode }) => affiliateCode)
    .reduce((acc, { attendees }) => (attendees || 0) + acc, 0);
  const revenueViaReferrals = eventTransactions
    .filter(({ affiliateCode }) => affiliateCode)
    .reduce((acc, { amountPaid }) => (amountPaid || 0) + acc, 0);
  const eventStartDateToNow = useMemo(() => {
    const dateFn =
      displayLineChart === "monthly"
        ? eachMonthOfInterval
        : displayLineChart === "weekly"
        ? eachWeekOfInterval
        : eachDayOfInterval;

    return dateFn({
      start: event?.createdAt ?? new Date(),
      end: new Date(),
    });
  }, [event?.createdAt, displayLineChart]);

  const registeredByDate = eventStartDateToNow.map((date) =>
    attendees.reduce((acc, { registrationDate }) => {
      const compareFn =
        displayLineChart === "monthly"
          ? isSameMonth
          : displayLineChart === "weekly"
          ? isSameWeek
          : isSameDay;
      return compareFn(date, registrationDate) ? acc + 1 : acc;
    }, 0)
  );
  console.log(attendees.map(({ registrationDate }) => registrationDate));
  console.log(
    registeredByDate.reduce((acc, curr) => acc + curr, 0),
    attendees.length
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
    <>
      <section className="bg-basePrimary/10 py-4 px-4 md:pl-4 md:pr-12 rounded-md flex items-center gap-8">
        <div className="bg-white/70 text-basePrimary rounded-full p-2 h-fit w-fit">
          <TargetIcon className="h-10 w-10" />
        </div>
        <div className="space-y-4 flex-1">
          <h2 className="text-basePrimary font-medium text-lg">Goals</h2>
          <div className="flex flex-col md:flex-row justify-evenly gap-6">
            <div className="bg-white/70 p-2 rounded-md space-y-2 flex-1">
              <div className="flex gap-2 items-center">
                <span className="w-5 h-5 text-basePrimary">
                  <img src={wallet.src} alt={"wallet"} />
                </span>
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
                  style={{
                    width:
                      (revenueTarget > 0 ? revenue / revenueTarget : 1) * 100 +
                      "%",
                  }}
                  className="h-full bg-basePrimary rounded-2xl transition-all"
                />
              </div>
              <div className="text-sm text-gray-600 font-medium text-center">
                <b>
                  {(
                    (revenueTarget > 0 ? revenue / revenueTarget : 1) * 100
                  ).toFixed() + "% "}
                </b>
                of revenue goal reached
              </div>
            </div>
            <div className="bg-white/70 p-2 rounded-md space-y-2 flex-1">
              <div className="flex gap-2 items-center">
                <span className="w-5 h-5 text-basePrimary">
                  <img src={people.src} alt={"people"} />
                </span>
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
              <div className="text-sm text-gray-600 font-medium text-center">
                <b>
                  {((registrations / registrationTarget) * 100).toFixed() +
                    "% "}
                </b>
                of registration goal reached
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-12">
        <AnalyticsInfoCard
          Icon={() => (
            <img className="h-10 w-10" src={people.src} alt={"people"} />
          )}
          label={"Total registrations"}
          value={registrations}
        />
        <AnalyticsInfoCard
          Icon={() => (
            <img className="h-10 w-10" src={wallet.src} alt={"wallet"} />
          )}
          label={"Revenue"}
          value={formatNumberToShortHand(revenue)}
        />
        <AnalyticsInfoCard
          Icon={() => (
            <img
              className="h-10 w-10"
              src={discountTag.src}
              alt={"discount tag"}
            />
          )}
          label={"Discount"}
          value={totalDiscountAmount}
          mutedText={
            <span className={"flex items-center text-xl gap-0.5"}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z" />
              </svg>{" "}
              <span className="h-fit">
                {totalDiscountRegistrations.toString()}
              </span>
            </span>
          }
        />
        <AnalyticsInfoCard
          Icon={() => (
            <img className="h-10 w-10" src={peopleAdd.src} alt={"people add"} />
          )}
          label={"Registrations via referrals"}
          value={registrationViaReferrals}
        />
        <AnalyticsInfoCard
          Icon={() => (
            <img className="h-10 w-10" src={moneyUp.src} alt={"money up"} />
          )}
          label={"Revenue via referrals"}
          value={formatNumberToShortHand(revenueViaReferrals)}
        />
        <AnalyticsInfoCard
          Icon={() => (
            <img
              className="h-10 w-10"
              src={peopleSync.src}
              alt={"people sync"}
            />
          )}
          label={"Returning Attendees"}
          value={recurringData?.recurringEmailCount ?? 0}
        />
      </section>
      <section className="bg-white p-4 space-y-4 rounded-md border">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-600 font-medium text-sm capitalize">
            {displayLineChart} Registrations
          </h2>
          <Select
            onValueChange={(timeDivision: string) =>
              setDisplayLineChart(timeDivision)
            }
            defaultValue={displayLineChart}
          >
            <SelectTrigger className="!w-fit">
              <SelectValue
                placeholder={"Select division"}
                className={cn(
                  "placeholder:text-sm !w-fit p-4",
                  !displayLineChart ? "text-gray-200" : "text-gray-700"
                )}
              />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] hide-scrollbar overflow-auto max-w-md">
              {timeDivisions.map((timeDivision, index) => (
                <SelectItem key={index} value={timeDivision} className="">
                  {timeDivision}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <LineChart
          colors={["#001FCC"]}
          sx={{
            [`& .MuiChartsAxis-tickLabel`]: {
              fill: "#4b5563 !important",
              fontSize: "10px !important",
            },
            "& .MuiAreaElement-series-yaxis": {
              //   fill: "url('#lineGradient')",
              fill: "#001FCC10",
            },
            "& .MuiChartsAxis-line": {
              stroke: "#4b5563 !important",
            },
          }}
          xAxis={[
            {
              data: eventStartDateToNow,
              scaleType: "time",
              valueFormatter: (date) =>
                format(
                  date,
                  displayLineChart === "monthly"
                    ? "MMM yy"
                    : displayLineChart === "weekly"
                    ? "dd MMM"
                    : "dd/MM/yy"
                ),
              tickMinStep:
                displayLineChart === "daily"
                  ? differenceInMilliseconds(
                      endOfDay(new Date()),
                      startOfDay(new Date())
                    )
                  : displayLineChart === "weekly"
                  ? differenceInMilliseconds(
                      endOfWeek(new Date()),
                      startOfWeek(new Date())
                    )
                  : displayLineChart === "monthly"
                  ? differenceInMilliseconds(
                      endOfMonth(new Date()),
                      startOfMonth(new Date())
                    )
                  : 0,
            },
          ]}
          series={[
            {
              id: "yaxis",
              data: registeredByDate,
              showMark: false,
              area: true,
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
        <section className="bg-white py-4 px-4 md:px-8 space-y-4 border rounded-md h-full max-h-[250px] overflow-hidden">
          <h2 className="text-gray-600 font-medium text-sm">
            Returning Attendees
          </h2>
          <div className="flex flex-col gap-2 max-h-full overflow-auto no-scrollbar">
            {recurringData &&
              recurringData?.recurringEmails
                .sort((a, b) => b.count - a.count)
                .map(({ email, count }) => (
                  <div className="flex items-center gap-4">
                    <div className="truncate text-gray-700 font-medium flex-1">
                      {email}
                    </div>
                    <span className="text-gray-900 font-medium">{count}</span>
                  </div>
                ))}
          </div>
        </section>
        <section className="bg-white py-4 px-4 md:px-8 space-y-4 border rounded-md h-full max-h-[250px]">
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
      <section className="grid md:grid-cols-2 gap-8">
        <section className="bg-white py-4 px-4 md:px-8 space-y-4 border rounded-md h-full overflow-hidden">
          <h2 className="text-gray-600 font-medium text-sm">
            Referral Link Performance
          </h2>
          <div className="flex flex-col gap-2 no-scrollbar">
            <div className="flex items-center gap-4 text-gray-800">
              <span className="flex flex-col text-gray-700 font-medium flex-[50%]">
                Affiliate
              </span>
              <span className="text-gray-900 font-medium flex-[20%]">Code</span>
              <span className="text-gray-900 font-medium flex-[20%]">Amt</span>
              <span className="text-gray-900 font-medium flex-[10%]">Qty</span>
            </div>
            {affiliateLinks &&
              affiliateLinks
                .filter(({ eventTransactions }) => eventTransactions)
                .sort(
                  (a, b) =>
                    (b.eventTransactions &&
                      b.eventTransactions.reduce(
                        (acc, { attendees }) => acc + attendees,
                        0
                      )) -
                    (a.eventTransactions &&
                      a.eventTransactions.reduce(
                        (acc, { attendees }) => acc + attendees,
                        0
                      ))
                )
                .map(({ eventTransactions, linkCode, affiliate }) => (
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex flex-col font-medium flex-[50%]">
                      <span className="capitalize">
                        {affiliate?.firstName + " " + affiliate?.lastname}
                      </span>
                      <span className="text-gray-600 text-xs">
                        {affiliate?.email}
                      </span>
                    </div>
                    <span className="font-medium flex-[20%]">
                      {linkCode}
                    </span>
                    <span className="font-medium flex-[20%]">
                      {formatNumberToShortHand(
                        eventTransactions
                          ? eventTransactions.reduce(
                              (acc, { amountPaid }) => acc + amountPaid,
                              0
                            )
                          : 0
                      )}
                    </span>
                    <span className="font-medium flex-[10%]">
                      {eventTransactions
                        ? eventTransactions.reduce(
                            (acc, { attendees }) => acc + attendees,
                            0
                          )
                        : 0}
                    </span>
                  </div>
                ))}
          </div>
        </section>
        <section className="bg-white py-4 px-4 md:px-8 space-y-4 border rounded-md">
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
          />
        </section>
      </section>
      <section className="bg-white py-4 px-4 md:px-8 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">
          Sales by Ticket Type
        </h2>
        <table className="border rounded-md w-full">
          <thead className="w-full">
            <tr className="flex bg-basePrimary/10 p-4 text-gray-600 font-medium">
              <td className="flex-[30%]">Name</td>
              <td className="flex-[25%]">Price</td>
              <td className="flex-[20%]">Qty</td>
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
      <section className="bg-white py-4 px-4 md:px-8 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">
          How Attendees Found You
        </h2>
        <div className="w-1/2 mx-auto flex flex-wrap justify-center gap-2">
          {[
            ...new Set(
              eventTransactions.map(({ referralSource }) => referralSource)
            ),
          ].map(
            (social) =>
              social && (
                <span
                  key={social}
                  className="rounded-3xl border p-4 capitalize text-3xl font-medium text-gray-700"
                >
                  {social}
                </span>
              )
          )}
        </div>
      </section>
    </>
  );
};

export default Registrations;
