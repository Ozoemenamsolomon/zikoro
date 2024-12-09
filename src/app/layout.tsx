import React from "react";
import type { Metadata } from "next";
import { montserrat } from "@/constants/fonts";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { SubscriptionModal } from "../components/contents/_components/modal/SubscriptionModal";

export const metadata: Metadata = {
  title: "Zikoro",
  description: "Event management software for all kinds of events",
  openGraph: {
    title: "Zikoro",
    description: "Event management software for all kinds of events",
    type: "website",
    url: "https://zikoro.com",
    images: [
      {
        url: "https://zikoro.com/og-image.jpg",
        alt: "Zikoro Event Management Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zikoro",
    description: "Event management software for all kinds of events",
    images: ["https://zikoro.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="text-mobile sm:text-desktop">
      <body className={`${montserrat.className}`}>
        {children}
        <Toaster {...TOASTER_PROPS} />
        <SubscriptionModal />
        {/* Google Tag Manager */}
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
      </body>
    </html>
  );
}
