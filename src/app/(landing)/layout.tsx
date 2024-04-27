import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

// export const metadata: Metadata = {
//   title: "Zikoro",
//   description: "",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section lang="en">
      {/* <Navbar /> */}
      <div className={`${montserrat.className} `}> {children}</div>
    </section>
  );
}
