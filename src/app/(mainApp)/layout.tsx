import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative h-full">
      <div className="fixed w-1/6 h-full top-0 left-0">
        <Sidebar />
      </div>
      <section className="ml-[16.666667%] border border-l-2">
        <Topbar />
        <div className="">{children}</div>
      </section>
    </main>
  );
}
