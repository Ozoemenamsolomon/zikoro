"use client";
import React, { useEffect, useState } from "react";
import CategoryEvent from "./CategoryEvent";
import { RightArrow } from "@/constants/icons";
import { useRouter } from "next/navigation";

export default function CategoryEventList() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);

  async function fetchEventCategories() {
    fetch("/api/explore/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    fetchEventCategories();
  }, []);

  const renderedCategories = new Set(); // Set to store rendered categories

  
  return (
    <div className="mt-[100px] max-w-6xl mx-auto pb-24 px-3 lg:px-0">
      {/* header */}
      <div className="flex justify-between">
        <p className="font-semibold text-[20px] lg:text-[32px]">
          Browse By Category
        </p>
        <div
          onClick={() => router.push("/explore/events-categories")}
          className="hidden lg:flex gap-x-4 cursor-pointer items-center"
        >
          <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
            See All
          </p>
          <RightArrow />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-x-4 gap-y-5 lg:gap-y-0 mt-[50px] bg-white ">
        {data?.length &&
          data?.map((category, index) => {
            if (
              category.eventCategory &&
              !renderedCategories.has(category.eventCategory)
            ) {
              renderedCategories.add(category.eventCategory); // Add category to renderedCategories set
              return (
                <CategoryEvent
                  key={index}
                  categoryName={category.eventCategory}
                  categoryCount={
                    category.eventCategory.length
                      ? category.eventCategory.length
                      : 0
                  }
                />
              );
            } else {
              return null; // Render nothing if category has already been rendered
            }
          })}
      </div>

      <div
        onClick={() => router.push("/explore/events-categories")}
        className="flex lg:hidden mt-[30px] justify-end gap-x-4 cursor-pointer items-center"
      >
        <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
          See All
        </p>
        <RightArrow />
      </div>
    </div>
  );
}
