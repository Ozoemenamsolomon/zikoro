"use client";

import { HeaderWidget } from "..";
import { useSearchParams } from "next/navigation";

export function EventHomeLayout({ children }: { children: React.ReactNode }) {
  const param = useSearchParams();
  const query = param.get("organization");
  return (
    <div className="w-full pb-32">
      <HeaderWidget currentQuery={query} />
      {children}
    </div>
  );
}
