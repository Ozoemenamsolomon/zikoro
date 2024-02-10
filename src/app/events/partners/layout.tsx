import type { Metadata } from "next";
import { PartnersProvider } from "@/context";


export const metadata: Metadata = {
  title: "Partners",
  description: "The sponsors and exhibitors of an event",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PartnersProvider>{ children}</PartnersProvider>
}
