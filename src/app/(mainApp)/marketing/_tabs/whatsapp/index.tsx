"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Whatsapp = () => {
  return (
    <Tabs defaultValue="account">
      <TabsList className="bg-transparent px-4 border-b pb-3 pt-2 flex justify-start w-full">
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="account"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="password"
        >
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default Whatsapp;
