import { AppointmentProvider } from "@/components/appointments/context/AppointmentContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Schedule and manage appointments`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppointmentProvider>
      <main className="bg-[#F9FAFF] min-h-screen">{children}</main>
    </AppointmentProvider>
)
}
