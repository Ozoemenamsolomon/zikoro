import Navbar from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zikoro Blog Post",
  description: "Zikoro Blog Post",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="">
      <Navbar />
      {children}
    </section>
  );
}
