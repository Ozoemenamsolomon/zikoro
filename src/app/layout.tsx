import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NetworkWrapper } from "@/components/wrappers";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zikoro",
  description: "Generated by create next app",
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
        <body className={`${inter.className}`}>
          <NetworkWrapper>
            <Toaster {...TOASTER_PROPS} />
            {children}
          </NetworkWrapper>
        </body>
      </html>
    </UserProvider>
  );
}
