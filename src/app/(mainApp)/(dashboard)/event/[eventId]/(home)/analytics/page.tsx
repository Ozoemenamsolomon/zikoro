"use client";
import TargetIcon from "@/public/icons/Target";
import UsersIcon from "@/public/icons/Users";
import { LineChart } from "@mui/x-charts";
import React, { ReactNode } from "react";
import { AccountBalanceWallet } from "styled-icons/material";

const AnalyticsInfoCard = ({
  label,
  Icon,
  value,
}: {
  Icon: (props: any) => React.JSX.Element;
  label: string;
  value: string;
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
  return (
    <section className="py-8 px-12 bg-basePrimary/5 space-y-12">
      <section className="bg-basePrimary/10 py-4 pl-4 pr-12 rounded-md flex items-center gap-8">
        <div className="bg-white/70 text-basePrimary rounded-full p-2 h-fit w-fit">
          <TargetIcon className="h-10 w-10" />
        </div>
        <div className="space-y-4 flex-1">
          <h2 className="text-basePrimary font-medium text-lg">Goals</h2>
          <div className="flex justify-evenly gap-6">
            <div className="bg-white/70 p-2 rounded-md space-y-2 flex-1">
              <div className="flex gap-2 items-center">
                <AccountBalanceWallet className="w-5 h-5 text-basePrimary" />
                <span className="text-gray-600 font-medium">Revenue</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600 text-sm">120k</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-600 text-sm">Target:</span>
                  <span className="text-gray-800">200k</span>
                </div>
              </div>
              <div className="w-full bg-basePrimary/20 rounded-2xl h-4">
                <div
                  style={{ width: 50 + "%" }}
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
                <span className="text-gray-600 text-sm">120k</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-600 text-sm">Target:</span>
                  <span className="text-gray-800">200k</span>
                </div>
              </div>
              <div className="w-full bg-basePrimary/20 rounded-2xl h-4">
                <div
                  style={{ width: 50 + "%" }}
                  className="h-full bg-basePrimary rounded-2xl transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-3 gap-12">
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Total registrations"}
          value={"120"}
        />
        <AnalyticsInfoCard Icon={UsersIcon} label={"Revenue"} value={"120k"} />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Total registrations"}
          value={"12.5k"}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Registrations via referrals"}
          value={"120k"}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"% Referrals via referrals"}
          value={"52%"}
        />
        <AnalyticsInfoCard
          Icon={UsersIcon}
          label={"Returning Attendees"}
          value={"12"}
        />
      </section>
      <section className="bg-white p-4 space-y-4">
        <h2 className="text-gray-600 font-medium text-sm">
          Daily Registrations
        </h2>
        <LineChart
          colors={["#001FCC"]}
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
              area: true,
              color: "#001FCC80",
            },
          ]}
          height={300}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
          //   grid={{ vertical: true, horizontal: true }}
        />
      </section>
    </section>
  );
};

export default page;
