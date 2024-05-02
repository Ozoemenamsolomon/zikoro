import Navbar from "@/components/Navbar";
import BlogHeader from "@/components/blog/BlogHeader";
import Footer from "@/components/Footer";
import BlogNav from "@/components/blog/BlogNav";
import { Metadata } from "next";



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
    <section className="">
      <Navbar />
      <BlogHeader />
      <BlogNav />
      {children}
      <Footer />
    </section>
  );
}
