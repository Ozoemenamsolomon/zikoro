"use client";

import { SideBarLayout } from "@/components";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative w-full h-full">
        <SideBarLayout />
        <div className="lg:w-[calc(100%-250px)]  min-[1024px]:float-right  pb-12  ">
          {children}
        </div>
      </main>
      <Toaster />
    </>
  );
}
