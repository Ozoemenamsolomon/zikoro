import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Create a new Event`,
  description: "Description",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#EEF0FF] fixed overflow-y-auto w-full h-full">
      <div className="w-[95%] sm:w-[550px] py-6 h-fit mx-auto ">
        <div className="w-full flex items-center justify-center mb-4">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={300}
            height={200}
            className="w-[150px] h-[40px]"
          />
        </div>

        <div className="flex flex-col w-full  rounded-lg h-fit  bg-white shadow py-7 px-3 sm:px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
