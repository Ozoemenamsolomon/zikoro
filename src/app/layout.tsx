import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
  });


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
    <UserProvider>
      <html lang="en" className=" text-mobile sm:text-desktop">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className={`${montserrat.className}`}>
          {children}
          <Toaster {...TOASTER_PROPS} />
        </body>
      </html>
    </UserProvider>
  )
}
