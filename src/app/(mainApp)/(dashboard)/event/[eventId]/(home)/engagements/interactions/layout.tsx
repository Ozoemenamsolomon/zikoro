
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engagement",
  description: "Event Engagements",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full">{children}</div>
}
