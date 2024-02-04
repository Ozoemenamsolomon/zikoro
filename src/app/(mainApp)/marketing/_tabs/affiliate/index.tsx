import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Create from "./create";

const Affiliate = () => {
  return (
    <Tabs defaultValue="performance">
      <TabsList className="bg-transparent">
        <TabsTrigger
          className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
          value="create"
        >
          Create
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
          value="performance"
        >
          Performance
        </TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Create />
      </TabsContent>
      <TabsContent value="performance">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default Affiliate;
