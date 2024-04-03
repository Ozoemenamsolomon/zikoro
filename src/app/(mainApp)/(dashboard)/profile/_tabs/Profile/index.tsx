import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProfile from "./MyProfile";

const Profile = () => {
  return (
    <Tabs defaultValue="myprofile" className="mt-0">
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="min-w-fit">
          <TabsList className="bg-transparent px-2 flex justify-start gap-4 w-full mt-0 h-fit py-2">
            <TabsTrigger
              className="py-0 px-0 data-[state=active]:shadow-none text-xs md:text-sm data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
              value="myprofile"
            >
              My profile
            </TabsTrigger>
            <TabsTrigger
              className="py-0 px-0 data-[state=active]:shadow-none text-xs md:text-sm data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
              value="contacts"
            >
              Contacts
            </TabsTrigger>
            <TabsTrigger
              className="py-0 px-0 data-[state=active]:shadow-none text-xs md:text-sm data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
              value="favourites"
            >
              Favourites
            </TabsTrigger>
            <TabsTrigger
              className="py-0 px-0 data-[state=active]:shadow-none text-xs md:text-sm data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
              value="tags"
            >
              Tags
            </TabsTrigger>
            <TabsTrigger
              className="py-0 px-0 data-[state=active]:shadow-none text-xs md:text-sm data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
              value="notes"
            >
              Notes
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent className="mt-0" value="myprofile">
        <MyProfile />
      </TabsContent>
    </Tabs>
  );
};

export default Profile;
