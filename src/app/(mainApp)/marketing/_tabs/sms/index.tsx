"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Compose from "./compose";

const SMS = () => {
  return (
    <Tabs defaultValue="account">
      <TabsList className="bg-transparent">
        <TabsTrigger
          className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
          value="compose"
        >
          Compose
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
          value="sent"
        >
          Sent
        </TabsTrigger>
      </TabsList>
      <TabsContent value="compose">
        <Compose />
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default SMS;
