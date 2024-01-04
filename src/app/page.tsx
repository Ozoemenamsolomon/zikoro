"use client"

import { Button, SideBarLayout } from "@/components";
import { EventCards } from "@/components/home";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
export default function Page() {
  return (
    <main className="w-full h-full">
      <SideBarLayout>
        <div className="w-full mb-4 sm:mb-6 items-center justify-between flex">
          <div className="flex flex-col gap-y-2 items-start justify-start">
            <h2 className="font-semibold text-base sm:text-2xl">
              Welcome Rasheed
            </h2>
            <p className="text-gray-500">How are you doing today?</p>
          </div>

          <Button className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium">
            <PlusCircle size={22} />
            <p>New Event</p>
          </Button>
        </div>

        <EventCards/>
       
      </SideBarLayout>
    </main>
  );
}
