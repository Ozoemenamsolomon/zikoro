import { montserrat } from "@/utils/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section lang="en">
      <div className={`${montserrat.className} `}> {children}</div>
    </section>
  );
}
