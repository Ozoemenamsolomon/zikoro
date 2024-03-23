"use client";
import { ContentTopNav } from "@/components/contents/_components";
import { useParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId } = useParams();

  return (
    <div className="w-full h-full">
      <ContentTopNav eventId={eventId} />

      <div className="w-full h-full"> {children}</div>
    </div>
  );
}
