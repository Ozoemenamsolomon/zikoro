import { AppointmentProvider } from "@/components/appointments/context/AppointmentContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Event management software for all kinds of events`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppointmentProvider>
      <main className="bg-basebody min-h-screen">{children}</main>
    </AppointmentProvider>
)
}
