import React, { useRef } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import useEventStore from "@/store/globalEventStore";
import { useGetAttendees } from "@/hooks";
import { ILead, TLeadsInterest } from "@/types/leads";
import { useGetData } from "@/hooks/services/request";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const size = {
  width: 400,
  height: 200,
};

interface TitleCountResult {
  titles: string[];
  counts: number[];
  offsets: number[];
}

function getTitleCounts(leadInterests: TLeadsInterest[]): TitleCountResult {
  // Create a Map to keep track of the counts for each title
  const titleMap = new Map<string, number>();

  // Iterate through each leadInterest and count the occurrences of each title
  leadInterests.forEach((leadInterest) => {
    if (leadInterest.title) {
      const title = leadInterest.title;
      if (titleMap.has(title)) {
        titleMap.set(title, (titleMap.get(title) || 0) + 1);
      } else {
        titleMap.set(title, 1);
      }
    }
  });

  // Extract titles and counts from the Map
  const titles: string[] = [];
  const counts: number[] = [];
  titleMap.forEach((count, title) => {
    titles.push(title);
    counts.push(count);
  });

  // Calculate the offsets based on the counts
  const maxCount = Math.max(...counts);
  const offsets = counts.map((count) => maxCount - count);

  return {
    titles,
    counts,
    offsets,
  };
}

interface ContactChannel {
  id: number;
  value: number;
  label: string;
}

const colorMap: { [key: string]: string } = {
  job: "purple",
  "booth staff": "blue",
  Offer: "black",
};

function extractUniqueContactChannels(leads: ILead[]): ContactChannel[] {
  const channelMap: { [key: string]: number } = {};

  // Count occurrences of each firstContactChannel
  leads.forEach((lead) => {
    if (channelMap[lead.firstContactChannel]) {
      channelMap[lead.firstContactChannel]++;
    } else {
      channelMap[lead.firstContactChannel] = 1;
    }
  });

  // Convert the channelMap to an array of ContactChannel objects
  const contactChannels: ContactChannel[] = Object.keys(channelMap).map(
    (channel, index) => ({
      id: index,
      value: channelMap[channel],
      label: channel,
      color: colorMap[channel] || "default-color", // Assign a default color if the channel is not in the colorMap
    })
  );

  return contactChannels;
}

const ThirdColumn = ({
  leads,
  partnerId,
}: {
  leads: ILead[];
  partnerId: string;
}) => {
  const { event } = useEventStore();
  const {
    attendees,
    getAttendees,
    isLoading: attendeesIsLoading,
  } = useGetAttendees({
    eventId: event?.eventAlias,
  });

  const { data: leadInterests, isLoading: interestsIsLoading } = useGetData<
    TLeadsInterest[]
  >(
    `/leads/interests?eventAlias=${event.eventAlias}&eventPartnerAlias=${partnerId}&interestType=Offer`
  );

  console.log(leadInterests);

  const containerDivRef = useRef<HTMLDivElement>();

  if (attendeesIsLoading) return <div>Loading...</div>;

  const productsDataset = getTitleCounts(leadInterests ?? []);

  console.log(containerDivRef.current?.offsetWidth);

  const leadsDataset = extractUniqueContactChannels(leads);

  console.log(
    leadsDataset.map(({ value }) => value),
    leads.length
  );

  return (
    <div className="space-y-4 bg-[#001FCC]/10 py-8" ref={containerDivRef}>
      <div className="space-y-4 px-2">
        <h2 className="text-gray-800 text-xl font-medium">
          Leads Analytic Overview
        </h2>
        <div className="p-4 flex flex-col gap-2 bg-white items-center">
          <h3 className="text-basePrimary font-medium text-sm">
            Percentage Retrieved
          </h3>
          <span className="text-xl font-bold">
            {leads.length > 0 ? Number((leads.length / attendees.length) * 100).toFixed() : 0}%
          </span>
          <span>
            You've retrieved <b>{leads.length}</b>
          </span>
          <span>
            out of <b>{attendees.length}</b> attendees
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Hot Leads</h3>
            <span className="text-xl font-bold">
              {leads.length > 0
                ? Number(
                    (leads.filter(({ leadType }) => leadType === "hot").length /
                      leads.length) *
                      100
                  ).toFixed()
                : 0}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => leadType === "hot").length ?? 0}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Warm Leads</h3>
            <span className="text-xl font-bold">
              {leads.length > 0
                ? Number(
                    (leads.filter(({ leadType }) => leadType === "warm")
                      .length /
                      leads.length) *
                      100
                  ).toFixed()
                : 0}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => leadType === "warm").length ??
                  0}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Cold Leads</h3>
            <span className="text-xl font-bold">
              {leads.length > 0
                ? Number(
                    (leads.filter(({ leadType }) => leadType === "cold")
                      .length /
                      leads.length) *
                      100
                  ).toFixed()
                : 0}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => leadType === "cold").length ??
                  0}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">
              Unknown Leads
            </h3>
            <span className="text-xl font-bold">
              {leads.length > 0
                ? Number(
                    (leads.filter(({ leadType }) => !leadType).length /
                      leads.length) *
                      100
                  ).toFixed()
                : 0}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => !leadType).length ?? 0}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white py-4 mx-2">
          <h2 className="text-gray-800 text-xl font-medium px-2">
            Leads Channels Overview
          </h2>
          <PieChart
            colors={["blue", "purple", "black"]}
            series={[
              {
                data: leadsDataset,
                innerRadius: 80,
                outerRadius: 120,
                cx: (containerDivRef.current?.offsetWidth ?? 100) / 2,
                cy: 150,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
                fontSize: "8px",
                color: "#001FCC",
                backgroundColor: "white",
                padding: "10px",
              },
            }}
            height={300}
            width={containerDivRef.current?.offsetWidth - 16}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
            margin={{ top: 2 }}
          />
          <div className="px-2">
            {leadsDataset.map(({ label, value, color, id }) => (
              <div
                key={id}
                className="border-b py-2 px-4 flex items-center gap-2 w-1/2"
              >
                <span
                  className="rounded-full h-5 w-5"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{label}</span>
                  <span className="font-medium text-gray-600">
                    {(leads && (value / leads.length) * 100) +
                      "%         (" +
                      (leads && value) +
                      ")"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white py-4 mx-2">
          <h2 className="text-gray-800 text-xl font-medium px-2">
            Products Overview
          </h2>
          <BarChart
            yAxis={[
              {
                scaleType: "band",
                data: productsDataset.titles,
                categoryGapRatio: 0.5,
                barGapRatio: 0.5,
              },
            ]}
            series={[
              {
                data: productsDataset.counts,
                stack: "total",
                color: "#001FCC",
              },
              {
                data: productsDataset.offsets,
                stack: "total",
                color: "#001FCC33",
              },
            ]}
            xAxis={[{ tickMinStep: 1 }]}
            layout="horizontal"
            height={200}
            width={containerDivRef.current?.offsetWidth - 16}
            borderRadius={20}
            loading={interestsIsLoading}
            margin={{ left: 100, top: 5 }}
            leftAxis={{ disableLine: true, disableTicks: true }}
            bottomAxis={{ disableLine: true, tickSize: 10 }}
            grid={{ vertical: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThirdColumn;
