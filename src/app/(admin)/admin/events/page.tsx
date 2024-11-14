import AdminEvents from "@/components/admin/events/AdminEvents";

export default function Page({ searchParams }:{searchParams: any}) {
  return <AdminEvents searchParams={searchParams} />;
}
