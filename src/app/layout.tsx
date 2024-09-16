import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { SubscriptionModal } from "../components/contents/_components/modal/SubscriptionModal";
import { montserrat } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "Zikoro",
  description: "Event management software for all kinds of events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className=" text-mobile sm:text-desktop">
      <body className={`${montserrat.className}`}>
        {children}
        <Toaster {...TOASTER_PROPS} />
        <SubscriptionModal />
      </body>
    </html>
  );
}
