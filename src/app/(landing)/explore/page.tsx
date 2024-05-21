"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import CopyrightFooter from "@/components/CopyrightFooter";
import EventHeader from "@/components/explore/EventHeader";
import EventList from "@/components/explore/SelectedLocationList";
import FeaturedEventList from "@/components/explore/FeaturedEventList";
import CitiesEventList from "@/components/explore/CitiesEventList";
import CategoryEventList from "@/components/explore/CategoryEventsList";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="">
      <Navbar />
      <EventHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <EventList  searchQuery={searchQuery} />
      <FeaturedEventList searchQuery={searchQuery}  />
      <CitiesEventList />
      <CategoryEventList />
      <CopyrightFooter/>
    </div>
  );
}
