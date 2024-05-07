import { useGetUserContactRequests } from "@/hooks/services/contacts";
import { TUser } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

const UserContacts = ({ user }: { user: TUser }) => {
  const { userContactRequests, isLoading: contactRequestIsLoading } =
    useGetUserContactRequests({ userEmail: user.userEmail });

  console.log(userContactRequests);

  return (
    <div>
      <h2 className="text-lg font-medium border-b pb-2 px-4">
        Contact Request
      </h2>
      <div className="">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image
              src={"/images/profile%201.png"}
              alt={"user avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="text-black">Contact request</p>
          </div>
          <span className="text-lg">x</span>
        </div>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image
              src={"/images/profile%201.png"}
              alt={"user avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="text-black">contact request</p>
          </div>
          <div className="flex gap-2">
          <Button className="border-2 bg-white border-basePrimary text-basePrimary w-fit px-2">
            Decline
          </Button>
          <Button className="bg-basePrimary w-fit px-2">Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContacts;
