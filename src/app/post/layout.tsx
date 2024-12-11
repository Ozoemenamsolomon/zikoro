import Navbar from "@/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="">
      <Navbar />
      {children}
    </section>
  );
}
