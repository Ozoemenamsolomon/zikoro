// @ts-nocheck
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import All from "./_tabs/all";
import AddOrganizationPaymentDetails from "@/components/forms/AddOrganizationPaymentDetails";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function page() {
  function updateSearchParam(
    searchParams: ReadonlyURLSearchParams,
    param: string,
    value: string
  ): URLSearchParams {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentSearchParams.set(param, value);

    return currentSearchParams;
  }

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname() || "/";

  function handleTabChange(currentTab: string) {
    console.log(currentTab);
    if (searchParams?.entries()) {
      const updatedSearchParams = updateSearchParam(
        searchParams,
        "tab",
        currentTab
      );
      console.log(updatedSearchParams.toString());
      router.push(`${pathName}?${updatedSearchParams.toString()}`, {
        shallow: true,
      });
    }
  }

  return (
    <section className="bg-white p-2 md:p-4 space-y-6">
      <Tabs
        onValueChange={(value) => handleTabChange(value)}
        defaultValue={searchParams.get("tab") || "details"}
        className=""
      >
        <TabsList className="bg-transparent">
          <TabsTrigger
            className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
            value="all"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
            value="details"
          >
            Account Details
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <All />
        </TabsContent>
        <TabsContent value="details">
          <AddOrganizationPaymentDetails />
        </TabsContent>
        <TabsContent value="invoices">Change your password here.</TabsContent>
      </Tabs>
    </section>
  );
}
