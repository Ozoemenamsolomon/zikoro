"use client"

import Image from "next/image";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#EEF0FF] fixed inset-0 w-full h-full">
      <div className="w-[95%] sm:w-[500px] h-fit max-h-[85%] m-auto inset-0 absolute ">
        <div className="w-full flex items-center justify-center mb-4">
          <Image
            src={"/images/zikoro.png"}
            alt="logo"
            width={300}
            height={200}
            className="w-[150px] h-[40px]"
          />
        </div>

        <div className="flex flex-col w-full reg-scroll-style overflow-y-auto no-scrollbar  rounded-lg h-fit max-h-[85%] bg-white shadow py-7 px-3 sm:px-4">
          {children}
        </div>
      </div>
    </div>
  );
}