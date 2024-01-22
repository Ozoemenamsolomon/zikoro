import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid grid-cols-12 relative h-full">
      <div className="relative col-span-2 h-full">
        <div className="w-full relative h-full">
          <Sidebar />
        </div>
      </div>
      <section className="col-span-10 border border-l-2">
        <Topbar />
        <div className="">{children}</div>
      </section>
    </main>
  );
}
