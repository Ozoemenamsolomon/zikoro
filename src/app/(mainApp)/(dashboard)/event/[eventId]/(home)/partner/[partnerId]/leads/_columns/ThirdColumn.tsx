import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import useEventStore from "@/store/globalEventStore";
import { useGetAttendees } from "@/hooks";
import { ILead } from "@/types/leads";

const dataset = [
  {
    product: "product1",
    impressions: 30,
  },
  {
    product: "product2",
    impressions: 35,
  },
  {
    product: "product3",
    impressions: 50,
  },
  {
    product: "product4",
    impressions: 55,
  },
  {
    product: "product5",
    impressions: 45,
  },
];

const ThirdColumn = ({ leads }: { leads: ILead[] }) => {
  const { event } = useEventStore();
  const {
    attendees,
    getAttendees,
    isLoading: attendeesIsLoading,
  } = useGetAttendees({
    eventId: event?.eventAlias,
  });

  if (attendeesIsLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 bg-[#001FCC]/10 py-8 px-2">
      <div className="space-y-4">
        <h2 className="text-gray-800 text-xl font-medium">
          Leads Analytic Overview
        </h2>
        <div className="p-4 flex flex-col gap-2 bg-white items-center">
          <h3 className="text-basePrimary font-medium text-sm">
            Percentage Retrieved
          </h3>
          <span className="text-xl font-bold">
            {Number((leads.length / attendees.length) * 100).toFixed()}%
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
              {(leads.filter(({ leadType }) => leadType === "hot").length /
                leads.length) *
                100}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => leadType === "hot").length}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Warm Leads</h3>
            <span className="text-xl font-bold">
              {(leads.filter(({ leadType }) => leadType === "warm").length /
                leads.length) *
                100}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => leadType === "warm").length}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Cold Leads</h3>
            <span className="text-xl font-bold">
              {(leads.filter(({ leadType }) => leadType === "cold").length /
                leads.length) *
                100}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => leadType === "cold").length}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">
              Unknown Leads
            </h3>
            <span className="text-xl font-bold">
              {(leads.filter(({ leadType }) => !leadType).length /
                leads.length) *
                100}
              %
            </span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">
                {leads.filter(({ leadType }) => !leadType).length}
              </b>{" "}
              out of <b className="text-gray-900">{leads.length}</b> scanned
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-gray-800 text-xl font-medium">
          Leads Channels Overview
        </h2>
        <PieChart
          colors={["blue", "purple", "black"]}
          series={[
            {
              arcLabel: (item) => `${item.label} (${item.value})`,
              arcLabelMinAngle: 45,
              data: [
                { id: 0, value: 10, label: "series A" },
                { id: 1, value: 15, label: "series B" },
                { id: 2, value: 20, label: "series C" },
              ],
              innerRadius: 60,
              outerRadius: 120,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontWeight: "bold",
              fontSize: "8px",
            },
          }}
          height={400}
          slotProps={{
            legend: {
              direction: "column",
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
        />
        <BarChart
          dataset={dataset}
          yAxis={[{ scaleType: "band", dataKey: "product" }]}
          series={[
            {
              dataKey: "impressions",
            },
          ]}
          layout="horizontal"
          height={250}
          borderRadius={20}
          colors={["purple"]}
        />
      </div>
    </div>
  );
};

export default ThirdColumn;
