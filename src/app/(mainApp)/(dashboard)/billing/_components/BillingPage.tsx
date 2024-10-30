// @ts-nocheck
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import All from "./_tabs/all";
import AddOrganizationPaymentDetails from "@/components/forms/AddOrganizationPaymentDetails";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { updateSearchParam } from "@/utils";

export default function BillingPage({ currentTab }: { currentTab: string }) {
  const router = useRouter();
  const pathName = usePathname() || "/";

  function handleTabChange(updatedTab: string) {
    console.log(currentTab, updatedTab);
    router.push(`${pathName}?currentTab=${updatedTab}`, {
      shallow: true,
    });
  }

  return (
    <section className="w-full mx-auto  max-w-[1300px] sm:px-6 mt-6 sm:mt-10 pt-[4.5rem] px-2 md:px-4 md:pb-4 pb-2  space-y-6">
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
