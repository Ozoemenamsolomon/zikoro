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
import { updateSearchParam } from "@/utils";

export default function page({ searchParams: { currentTab } }) {

  const router = useRouter();
  const pathName = usePathname() || "/";

  function handleTabChange(updatedTab: string) {
    console.log(currentTab, updatedTab);
    router.push(`${pathName}?currentTab=${updatedTab}`, {
      shallow: true,
    });
  }

  return (
    <section className="bg-white pt-[4.5rem] px-2 md:px-4 md:pb-4 pb-2  space-y-6">
      <Tabs
        onValueChange={(value) => handleTabChange(value)}
        defaultValue={currentTab || "all"}
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
