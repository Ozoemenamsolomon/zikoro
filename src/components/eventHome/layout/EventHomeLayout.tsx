"use client";

import { HeaderWidget } from "..";
import { useSearchParams } from "next/navigation";

export function EventHomeLayout({
  children,
  searchParams: { organization: query },
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full pb-32">
      <HeaderWidget currentQuery={query} />
      {children}
    </div>
  );
}
