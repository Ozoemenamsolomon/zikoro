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
  let renderedCategoryCount = 0;

  return (
    <>
      {data?.length > 0 && (
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
                // Count the number of occurrences of the current city in the data array
                const categoryCount = data.filter(
                  (c) => c.eventCategory === category.eventCategory
                ).length;

                if (
                  category.eventCategory &&
                  !renderedCategories.has(category.eventCategory) &&
                  renderedCategoryCount < 4 // Check if we've rendered less than 4 unique categories
                ) {
                  renderedCategories.add(category.eventCategory); // Add category to renderedCategories set
                  renderedCategoryCount++; // Increment the rendered category count
                  return (
                    <CategoryEvent
                      key={index}
                      categoryName={category.eventCategory}
                      categoryCount={categoryCount}
                    />
                  );
                } else {
                  return null; // Render nothing if category has already been rendered or we've already rendered 4 unique categories
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
      )}
    </>
  );
}
