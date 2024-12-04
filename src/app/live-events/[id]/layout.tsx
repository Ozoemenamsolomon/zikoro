import type { Metadata } from "next";


export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white w-full h-full fixed overflow-y-auto">{children}</div>;
}
