"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Create from "./_tabs/create";
import Performance from "./_tabs/performance";
import Affiliates from "./_tabs/affiliates";

const Affiliate = () => {
  return (
    <Tabs defaultValue="affiliates">
      <TabsList className="bg-transparent px-4 border-b pb-3 pt-2 flex justify-start w-full">
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="create"
        >
          Create
        </TabsTrigger>
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="performance"
        >
          Performance
        </TabsTrigger>
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="affiliates"
        >
          Affiliates
        </TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Create />
      </TabsContent>
      <TabsContent value="performance">
        <Performance />
      </TabsContent>
      <TabsContent value="affiliates">
        <Affiliates />
      </TabsContent>
    </Tabs>
  );
};

export default Affiliate;
