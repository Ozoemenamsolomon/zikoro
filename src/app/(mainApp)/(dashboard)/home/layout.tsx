import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "",
  };
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="relative w-full bg-[#F9FAFF] min-h-screen">
       {children}
      </div>
    );
  }
  