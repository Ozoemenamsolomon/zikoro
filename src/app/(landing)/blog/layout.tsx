import BlogHeader from "@/components/blog/BlogHeader";
import Footer from "@/components/Footer";
import BlogNav from "@/components/blog/BlogNav";
import { Montserrat } from "next/font/google";
import { Metadata } from "next";

const montserrat = Montserrat({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: " Zikoro Blog",
  description: "",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`${montserrat.className} `}>
      <BlogHeader />
      <BlogNav />
      {children}
      <Footer />
    </section>
  );
}
