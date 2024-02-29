import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NetworkWrapper } from "@/components/wrappers";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { metaGenerator } from "./meta";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> =>
  await metaGenerator();

export default function RootLayout({
  children,
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className=" text-mobile sm:text-desktop">
     <UserProvider>
     <body className={`${inter.className}`}>
        <NetworkWrapper>
          <Toaster {...TOASTER_PROPS} />
          {children}
        
        </NetworkWrapper>
      </body>
     </UserProvider>
    </html>
  );
}
