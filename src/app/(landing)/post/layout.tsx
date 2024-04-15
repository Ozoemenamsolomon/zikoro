import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import { Montserrat } from "next/font/google";
import { Metadata } from "next";

// const montserrat = Montserrat({
//   weight: ["200", "300", "400", "500", "600", "700", "800"],
//   subsets: ["latin"],
//   display: "swap",
//   fallback: ["Arial", "sans-serif"],
// });

export const metadata: Metadata = {
  title: "Zikoro Blog Post",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      <Navbar />
      {children}
      <Footer />
    </section>
  );
}
