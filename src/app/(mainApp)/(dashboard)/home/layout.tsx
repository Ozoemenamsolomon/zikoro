import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
  };
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="relative w-full h-full">
       {children}
      </div>
    );
  }
  