"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
import { NavigateNext } from "@styled-icons/material-rounded/NavigateNext";
import { Children, useState } from "react";
import { Title } from "styled-icons/material";
export function CollapsibleWidget({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [isVisible, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility((prev) => !prev);
  };
  return (
    <section className="flex flex-col w-full  min-h-max">
      <div className="w-full flex items-center justify-between px-3 py-3 border-y ">
        <p className="font-semibold text-base sm:text-xl">{title}</p>
        <div className="flex items-center gap-x-2">
          <p>{title}</p>
          <Button className="w-fit h-fit px-1">
            <EditOutline size={20} />
          </Button>
          <Button onClick={toggleVisibility} className="w-fit h-fit px-1">
            <NavigateNext
              className={`transform transition-all duration-300 ease-in-out ${
                isVisible ? "-rotate-90" : "rotate-90"
              }`}
              size={20}
            />
          </Button>
        </div>
      </div>
      {isVisible && (
        <div
          className={cn(
            "h-0 w-full transform ease-in-out transition-all duration-500",
            isVisible && "h-fit"
          )}
        >
          {children}
        </div>
      )}
    </section>
  );
}
