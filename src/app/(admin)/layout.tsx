import { AdminSideBar } from "@/components/admin/AdminSideBar/AdminSideBar";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
  });

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
      <main className={`${montserrat.className} relative w-full h-full bg-[#F9FAFF]`}>
        <AdminSideBar />

        <div className="lg:w-[calc(100%-250px)]  min-[1024px]:float-right  pb-12  ">
          {children}
        </div>
      </main>
      
    </>
  );
}
