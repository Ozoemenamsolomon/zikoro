import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zikoro Pricing",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      {children}
    </section>
  );
}
