"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "styled-icons/ionicons-outline";
import { ArrowRight } from "styled-icons/typicons";
import { useRouter } from "next/navigation";

type Props = {
  updateModalState: () => void;
};

export default function PricingTable({ updateModalState }: Props) {
  const [freeFeatures, setFreeFeatures] = useState<boolean>(false);
  const [liteFeatures, setLiteFeatures] = useState<boolean>(false);
  const [profFeatures, setProfFeatures] = useState<boolean>(false);
  const [busFeatures, setBusFeatures] = useState<boolean>(false);

  const router = useRouter();

  return (
    <div className=" my-[75px] lg:my-[75px] px-5 lg:px-0 max-w-full lg:max-w-7xl mx-auto">
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Free Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg">
          <div>
            {/* title */}
            <p className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-2xl font-bold ">
              Free
            </p>
            <div className="h-[68px]"></div>

            <p className="text-2xl font-bold text-zikoroBlue mt-6">
              {" "}
              ₦0 <span className="text-[14px] text-gray-400">/month</span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[47px] text-base font-bold text-white py-2 cursor-pointe opacity-50"
                onClick={() => updateModalState()}
                disabled
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-zikoroBlue mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>
            {/* 
            {!freeFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setFreeFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setFreeFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Lite Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg">
          <div>
            {/* title */}
            <p className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-2xl font-bold ">
              Lite
            </p>

            {/* description */}
            <p className="text-[14px] h-[68px]">
              Perfect for personal events like weddings, celebrations of life,
              birthdays e.t.c.
            </p>

            <p className="text-2xl font-bold text-zikoroBlue mt-6">
              {" "}
              ₦15000 <span className="text-[14px] text-gray-400">
                /month
              </span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[47px] text-base font-bold text-white py-2 cursor-pointer"
                onClick={() => updateModalState()}
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-zikoroBlue mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>

            {/* {!liteFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setLiteFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setLiteFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Professional Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white">
          <div>
            {/* title */}
            <p className=" text-2xl font-bold ">Professional</p>

            {/* description */}
            <p className="text-[14px] h-[68px] ">
              For mid-sized events like Galas & Fundraisers, Meetings & Small
              Summits, Launch Events, Shows & Performances with options to
              scale.
            </p>

            <p className="text-2xl font-bold mt-6">
              {" "}
              ₦15000 <span className="text-[14px] text-gray-400 ">
                /month
              </span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-white rounded-[47px] text-base font-bold text-zikoroBlue py-2 cursor-pointer"
                onClick={() => updateModalState()}
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-white mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>

            {/* {!profFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setProfFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setProfFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Business Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg">
          <div>
            {/* title */}
            <p className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-2xl font-bold ">
              Business
            </p>

            {/* description */}
            <p className="text-[14px] h-[68px] ">
              For large-scale events like Conferences, Summits, large Private
              Events, Event Teams & Agencies.
            </p>

            <p className="text-2xl font-bold text-zikoroBlue mt-6">
              {" "}
              ₦15000 <span className="text-[14px] text-gray-400">
                /month
              </span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[47px] text-base font-bold text-white py-2 cursor-pointer"
                onClick={() => updateModalState()}
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-zikoroBlue mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>

            {/* {!busFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setBusFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setBusFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* <p className="py-[87px] text-center text-zikoroBlue cursor-pointer">
        See our complete feature comparison{" "}
        <ArrowRight size={16} className="text-zikoroBlue" />
      </p> */}
    </div>
  );
}
