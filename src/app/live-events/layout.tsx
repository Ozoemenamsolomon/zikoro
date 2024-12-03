import type { Metadata } from "next";


// export const metadata: Metadata = {
//   title: `Live Event`,
//   description: "Attendee Event Registration",
// };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white w-full h-full fixed overflow-y-auto">
      <>{children}</>
     
    </div>
  );
}
