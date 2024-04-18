"use client";
import { FullScreenMinimize } from "@styled-icons/fluentui-system-regular/FullScreenMinimize";
import { Button, Portal } from "@/components";
import { NavigateNext } from "@styled-icons/material-rounded/NavigateNext";
import { NavigateBefore } from "@styled-icons/material-rounded/NavigateBefore";
import { Custom, Others } from "..";
import { useState, useEffect } from "react";
import { cn } from "@/lib";
import { LiveView } from "@/constants";


const sessionComponent = [
  {
    Session: Others,
    props: {
      data: {timeStamp:"Today", session: [{title: "Registration"}]},
      className: "w-[87vw]",
    },
  },
  {
    Session: Custom,
    props: {
      data: {timeStamp:"Today", session: [{title: "Introduction to Software Engineering"}, {title: "Basics of Mechatronics"}]},
      className: "w-[87vw]",
    },
  },
  {
    Session: Others,
    props: {
      data: {timeStamp:"Today", session: [{title: "Launch"}]},
      className: "w-[87vw]",
    },
  },
  {
    Session: Custom,
    props: {
      data: {timeStamp: "Today", session: [{title: "Introduction to Software Engineering"}]},
      className: "w-[87vw]",
    },
  },
  {
    Component: Others,
    props: {
      title: {timeStamp:"Today", session: [{title: "Break"}]},
      className: "w-[87vw]",
    },
  },
];

export function FullScreenView({ close }: { close: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % sessionComponent?.length
      );
    }, 30000000);
    return () => clearInterval(interval);
  }, [currentIndex, sessionComponent?.length]);

  return (
    <>
      <div className="w-screen min-h-screen fixed inset-0 z-[600] bg-white ">
        <div className="w-full flex items-end px-4 justify-end mt-6">
          <Button onClick={close}>
            <FullScreenMinimize size={20} />
          </Button>
        </div>
        <div className="w-screen group  h-full flex items-center relative">
          <div className="w-[95%] z-50 sm:hidden group-hover:sm:flex h-full inset-0 m-auto absolute flex items-center justify-between">
            <Button
              onClick={() => {
                setCurrentIndex((currentIndex - 1) % sessionComponent.length);
              }}
              className="bg-black/10 rounded-full h-10 w-10 px-0"
            >
              <NavigateBefore className="text-gray-50" size={22} />
            </Button>
            <Button
              onClick={() => {
                setCurrentIndex((currentIndex + 1) % sessionComponent.length);
              }}
              className="bg-black/10 rounded-full h-10 w-10 px-0"
            >
              <NavigateNext className="text-gray-50" size={22} />
            </Button>
          </div>
          {sessionComponent
            ?.filter((_, index) => currentIndex === index)
            .map(({ Session, props }, index) => (
              <div
                key={index}
                className={cn(
                  " w-[87vw] mx-auto h-fit transform transition-all duration-300 "
                )}
              >
                <Session {...props} />
              </div>
            ))}
        </div>
        <div className="hidden items-center gap-x-2 mx-auto absolute right-[25%] bottom-2 px-4 w-fit justify-center h-12 rounded-lg text-[11px] sm:text-xs bg-basePrimary text-gray-50">
          <LiveView />
          <p>Live</p>
        </div>
      </div>
    </>
  );
}
