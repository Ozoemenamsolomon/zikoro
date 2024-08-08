"use client";
import React, { useEffect, useState } from "react";
import CategoryEvent from "@/components/explore/CategoryEvent";
import Navbar from "@/components/Navbar";
import CopyrightFooter from "@/components/CopyrightFooter";

interface Category {
  eventCategory: string;
}

export default function EventsCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [showMore, setShowMore] = useState(false);

  // Fetch categories
  async function fetchEventCategories() {
    try {
      const response = await fetch("/api/explore/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // See more function
  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  useEffect(() => {
    fetchEventCategories();
  }, []);

  const renderedCategories = new Set<string>(); // Set to store rendered categories

  return (
    <>
      {data && data.length > 0 && (
        <div>
          <Navbar />
          {/* header */}
          <div className="px-1 lg:px-0 max-w-full lg:max-w-6xl mx-auto pb-12 mt-40 lg:mt-48">
            <div className="mt-24 text-center">
              <p className="text-[24px] lg:text-[40px] gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold">
                Explore Event Categories
              </p>
              <p className="text-[16px] lg:text-[24px] font-normal">
                Discover exciting events in different categories across the
                globe
              </p>
            </div>

            {/* Events categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 lg:gap-y-12 mt-12 lg:mt-24 px-[10px] lg:px-0">
              {data &&
                (showMore ? data : data.slice(0, 20)).map((category, index) => {
                  const categoryCount = data.filter(
                    (c) => c.eventCategory === category.eventCategory
                  ).length;
                  if (
                    category.eventCategory &&
                    !renderedCategories.has(category.eventCategory)
                  ) {
                    renderedCategories.add(category.eventCategory);
                    return (
                      <CategoryEvent
                        key={index}
                        categoryName={category.eventCategory}
                        categoryCount={categoryCount}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
            </div>

            {data.length > 16 && !showMore && (
              <div className="flex justify-center items-center mt-12">
                <button
                  onClick={handleSeeMoreClick}
                  className="text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
                >
                  See more
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <CopyrightFooter />
        </div>
      )}
    </>
  );
}
