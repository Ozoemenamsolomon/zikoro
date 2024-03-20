"use client";
import React from "react";
import Navbar from "@/components/Navbar2";
import Footer from "@/components/Footer";
import EventHeader from "@/components/explore/EventHeader";
import { Montserrat } from "next/font/google";
import EventList from "@/components/explore/EventList";
import FeaturedEventList from "@/components/explore/FeaturedEventList";
import CitiesEventList from "@/components/explore/CitiesEventList";
import CategoryEventList from "@/components/explore/CategoryEventsList";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function Events() {
  return (
    <div className={`${montserrat.className} `}>
      <Navbar />
      <EventHeader />
      <EventList />
      <FeaturedEventList />
      <CitiesEventList />
      <CategoryEventList />
      <Footer />
    </div>
  );
}
