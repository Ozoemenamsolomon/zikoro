import React from "react"
import type { Metadata } from "next";
import { Inter, Heebo, Montserrat } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });
const heebo = Heebo({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="en" className="">
        <body className={`${inter.className} ${heebo.className}`}>
                {children}
                <ToastContainer/>
        </body>
      </html>
    
    </UserProvider>
  );
}
