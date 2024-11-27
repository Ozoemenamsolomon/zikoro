import AdminTransactions from "@/components/admin/transactions/AdminEventTransactions";

export default function Page({ searchParams }: { searchParams: any }) {
  return <AdminTransactions searchParams={searchParams} />;
}
