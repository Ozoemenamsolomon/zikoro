import { AdminSideBar } from "@/components/admin/AdminSideBar/AdminSideBar";
import { montserrat } from "@/utils/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Zikoro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main
        className={`relative w-full h-full bg-[#F9FAFF]`}
      >
        <AdminSideBar />

        <div className="lg:w-[calc(100%-250px)]  min-[1024px]:float-right  pb-12  ">
          {children}
        </div>
      </main>
    </>
  );
}
