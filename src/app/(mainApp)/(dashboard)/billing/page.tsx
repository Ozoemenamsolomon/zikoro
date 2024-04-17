// @ts-nocheck
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import All from "./_tabs/all";

export default function page() {
  return (
    <section className="bg-white p-2 md:p-4 space-y-6">
      <Tabs defaultValue="all" className="">
        <TabsList className="bg-transparent">
          <TabsTrigger
            className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
            value="all"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
            value="invoices"
          >
            Invoices
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <All />
        </TabsContent>
        <TabsContent value="invoices">Change your password here.</TabsContent>
      </Tabs>
    </section>
  );
}
