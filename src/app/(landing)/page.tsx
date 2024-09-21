"use client";
import Navbar from "@/components/Navbar";
import Section1 from "@/components/home/Section1";
import Section2 from "@/components/home/Section2";
import Section3 from "@/components/home/Section3";
import Section4 from "@/components/home/Section4";
import Section5 from "@/components/home/Section5";
import Footer from "@/components/Footer";
import { montserrat } from "@/utils/fonts";

export default function Home() {
  return (
    <div className={`${montserrat.className} `}>
      <Navbar />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </div>
  );
}
