import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Event Home Page",
  description: "The event schedules and description",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full">{ children}</div>
}
