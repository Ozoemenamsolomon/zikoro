import Image from "next/image";
import React from "react";

const UserContacts = () => {
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
            <p className="text-black">contact request declined.</p>
          </div>
          <span className="text-lg">x</span>
        </div>
        
      </div>
    </div>
  );
};

export default UserContacts;
