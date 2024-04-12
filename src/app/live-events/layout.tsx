import type { Metadata } from "next";


export const metadata: Metadata = {
  title: `Published Events`,
  description: "Lists of Upcoming and Past Events",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white w-full h-full">
      <>{children}</>
     
    </div>
  );
}
