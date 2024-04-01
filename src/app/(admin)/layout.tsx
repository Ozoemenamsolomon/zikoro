import { AdminSideBar } from "@/components/admin/AdminSideBar/AdminSideBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Zikoro",
    description: "",
  };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="relative w-full h-full bg-[#F9FAFF]">
        <AdminSideBar />

        <div className=" pt-12 sm:pt-16 lg:w-[calc(100%-250px)]  min-[1024px]:float-right  pb-12  ">
          {children}
        </div>
      </main>
      
    </>
  );
}
