import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import CopyrightFooter from "@/components/CopyrightFooter";

export const metadata: Metadata = {
  title: "Zikoro Blog Post",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      <Navbar />
      {children}
    </section>
  );
}
