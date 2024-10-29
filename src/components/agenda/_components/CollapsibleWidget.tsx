"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { NavigateNext } from "styled-icons/material-rounded";
import { useState } from "react";
import {Edit} from "."
import {TAgenda, Event} from "@/types"
export function CollapsibleWidget({
  children,
  title,
  session,
  event,
  isNotAttendee,
  refetch
}: {
  children: React.ReactNode;
  title: string;
  session: TAgenda; 
  event?: Event | null;
  isNotAttendee:boolean;
  refetch?: () => Promise<any>;
}) {
  const [isVisible, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility((prev) => !prev);
  };

  
  return (
    <section className="flex flex-col w-full  min-h-max">
      <div 
      role="button"
      onClick={toggleVisibility}
      className="w-full flex items-center justify-between px-3 py-3 border-b ">
        <p className="font-medium text-base sm:text-xl">{title}</p>
      {isNotAttendee &&  <div className="flex items-center gap-x-2">
          <p>{title}</p>
          <Edit session={session} event={event} refetch={refetch} />
          <Button className="w-fit h-fit px-1">
            <NavigateNext
              className={`transform transition-all duration-300 ease-in-out ${
                isVisible ? "-rotate-90" : "rotate-90"
              }`}
              
              size={20}
            />
          </Button>
        </div>}
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
