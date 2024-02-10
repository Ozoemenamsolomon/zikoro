import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Create from "./create";
import Affiliates from "./affiliates";

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
          affiliates
        </TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Create />
      </TabsContent>
      <TabsContent value="performance">Change your password here.</TabsContent>
      <TabsContent value="affiliates">
        <Affiliates />
      </TabsContent>
    </Tabs>
  );
};

export default Affiliate;
