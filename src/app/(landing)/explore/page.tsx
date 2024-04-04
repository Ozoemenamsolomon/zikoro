"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventHeader from "@/components/explore/EventHeader";
import EventList from "@/components/explore/EventList";
import FeaturedEventList from "@/components/explore/FeaturedEventList";
import CitiesEventList from "@/components/explore/CitiesEventList";
import CategoryEventList from "@/components/explore/CategoryEventsList";

export default function Events() {
  return (
    <div className=''>
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
