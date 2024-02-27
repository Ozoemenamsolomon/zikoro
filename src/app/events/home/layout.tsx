import type { Metadata } from "next";
import { PartnersProvider } from "@/context";


export const metadata: Metadata = {
  title: "Event Home Page",
  description: "The event schedules and description",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return  children
}
