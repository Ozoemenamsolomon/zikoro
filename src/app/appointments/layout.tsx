import { AppointmentProvider } from "@/components/appointments/context/AppointmentContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Schedule and manage appointments`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // const supabase = createClient()
  // const {data:{user},error} = await supabase.auth.getUser()
  // console.log({user,error})
  // if(!user){
  //   redirect('https://www.zikoro.com/bookings')
  // }
  return (
    <AppointmentProvider>
      <main className="bg-[#F9FAFF] min-h-screen">{children}</main>
    </AppointmentProvider>
)
}
