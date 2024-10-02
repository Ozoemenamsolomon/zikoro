import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { SubscriptionModal } from "../components/contents/_components/modal/SubscriptionModal";


export const metadata: Metadata = {
  title: "Zikoro",
  description: "Event management software for all kinds of events",
  other: {
    fonts: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap">`
   
  },
};
// 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className=" text-mobile sm:text-desktop">
   
      <body >
        {children}
        <Toaster {...TOASTER_PROPS} />
        <SubscriptionModal />
      </body>
    </html>
  );
}
