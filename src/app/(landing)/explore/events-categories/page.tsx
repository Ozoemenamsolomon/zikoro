"use client";
import React, { useEffect, useState } from "react";
import CategoryEvent from "@/components/explore/CategoryEvent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EventsCategories() {
  type DBEventCategories = {
    // id: number;
  };

  const [data, setData] = useState<DBEventCategories[] | undefined>(undefined);

  async function fetchEventCategories() {
    fetch("/api/explore/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    fetchEventCategories();
  }, []);

  return (
    <div className="">
      <Navbar />
      {/* header */}
      <div className="px-1 lg:px-0 max-w-full lg:max-w-6xl mx-auto pb-12 mt-40 lg:mt-48">
        <div className="mt-24 text-center">
          <p className="text-[24px] lg:text-[40px]  gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold">
            Explore Event Categories
          </p>
          <p className="text-[16px] lg:text-[24px] font-normal">
            Discover exciting events in different categories across the globe
          </p>
        </div>

        {/* Events categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 lg:gap-y-12 mt-12 lg:mt-24 px-[10px] lg:px-0">
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
          <CategoryEvent />
        </div>

        <div className="flex justify-center items-center mt-12">
          <button className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white">
            See more
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
