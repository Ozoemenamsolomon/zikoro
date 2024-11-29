import React from "react";
import type { Metadata } from "next";
import { montserrat } from "@/constants/fonts";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { SubscriptionModal } from "../components/contents/_components/modal/SubscriptionModal";
import Head from "next/head";

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
      <Head>
        {/* Google Tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KQQS740F2E"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KQQS740F2E');
            `,
          }}
        />
        {/* Google Fonts */}
      </Head>
      <body className={`${montserrat.className}`}>
        {children}
        <Toaster {...TOASTER_PROPS} />
        <SubscriptionModal />
      </body>
    </html>
  );
}
