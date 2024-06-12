import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

const dataset = [
  {
    product: "product1",
    impressions: 30,
  },
  {
    product: "product2",
    impressions: 30,
  },
  {
    product: "product3",
    impressions: 50,
  },
];

const ThirdColumn = () => {
  return (
    <div className="space-y-8 bg-[#001FCC]/10 py-8 px-4">
      <div className="space-y-4">
        <h2 className="text-gray-800 text-xl font-medium">
          Leads Analytic Overview
        </h2>
        <div className="p-4 flex flex-col gap-2 bg-white items-center">
          <h3 className="text-basePrimary font-medium text-sm">
            Percentage Retrieved
          </h3>
          <span className="text-xl font-bold">75%</span>
          <span>
            You've retrieved <b>750</b>
          </span>
          <span>
            out of <b>1000</b> attendees
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Hot Leads</h3>
            <span className="text-xl font-bold">35%</span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">400</b> out of{" "}
              <b className="text-gray-900">750</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Warm Leads</h3>
            <span className="text-xl font-bold">40%</span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">350</b> out of{" "}
              <b className="text-gray-900">750</b> scanned
            </span>
          </div>
          <div className="p-4 flex flex-col gap-2 bg-white items-center">
            <h3 className="text-basePrimary font-medium text-sm">Cold Leads</h3>
            <span className="text-xl font-bold">25%</span>
            <span className="text-xs text-center text-gray-700">
              <b className="text-gray-900">400</b> out of{" "}
              <b className="text-gray-900">750</b> scanned
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
          height={500}
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
          xAxis={[
            {
              label: "Impressions",
              categoryGapRatio: 0.75,
              barGapRatio: 0.2,
            },
          ]}
          height={500}
        />
      </div>
    </div>
  );
};

export default ThirdColumn;
