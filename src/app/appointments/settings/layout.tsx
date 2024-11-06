import SettingsMain from "@/components/appointments/ui/Layout/SettingsMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Zikoro: Appointment Settings`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
 
  return (
    <SettingsMain >
      {children}
    </SettingsMain>
)
}
