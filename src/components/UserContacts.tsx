import {
  useGetContactRequests,
  useRespondToContactRequest,
} from "@/hooks/services/contacts";
import { TUser } from "@/types";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderAlt } from "styled-icons/boxicons-regular";

const UserContacts = ({ user }: { user: TUser }) => {
  const {
    userContactRequests,
    isLoading: contactRequestIsLoading,
    getContactRequests,
  } = useGetContactRequests({ userEmail: user.userEmail });

  // console.log(userContactRequests);

  const [action, setAction] = useState<"accept" | "reject" | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  const { respondToContactRequest, isLoading } = useRespondToContactRequest();

  const onSubmit = async (
    userEmail: string,
    contactUserEmail: string,
    contactRequestId: number
  ) => {
    if (!action) return;

    await respondToContactRequest({
      payload: {
        body: { contactUserEmail, userEmail, contactRequestId },
        action,
      },
    });

    await getContactRequests();
  };

  return (
    <div>
      <h2 className="text-lg font-medium border-b p-4">Contact Request</h2>
      {contactRequestIsLoading && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
      {!contactRequestIsLoading && (
        <div className="">
          {userContactRequests?.map((request) => (
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    className="h-full w-full object-cover"
                    src={request.sender.profilePicture ?? ""}
                  />
                  <AvatarFallback>
                    <span className="uppercase text-sm">
                      {request.sender.firstName[0] + request.sender.lastName[0]}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <p className="text-black">
                  contact request from{" "}
                  {request.sender.firstName + " " + request.sender.lastName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setOpen(true);
                    setAction("reject");
                  }}
                  className="border-2 bg-white border-basePrimary text-basePrimary w-fit px-2"
                >
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    setOpen(true);
                    setAction("accept");
                  }}
                  className="bg-basePrimary w-fit px-2"
                >
                  Accept
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent>
                    {" "}
                    <DialogHeader>
                      <DialogTitle>
                        <span className="capitalize">
                          {action} Contact Information of{" "}
                          {request.sender.firstName +
                            " " +
                            request.sender.lastName}
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 items-center py-4">
                        <svg
                          width={57}
                          height={50}
                          viewBox="0 0 57 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M55.6998 41.0225L33.8373 3.05501C33.2909 2.12482 32.511 1.35356 31.5748 0.817663C30.6385 0.281767 29.5785 -0.000152588 28.4998 -0.000152588C27.421 -0.000152588 26.361 0.281767 25.4247 0.817663C24.4885 1.35356 23.7086 2.12482 23.1623 3.05501L1.29975 41.0225C0.774092 41.9222 0.49707 42.9455 0.49707 43.9875C0.49707 45.0295 0.774092 46.0528 1.29975 46.9525C1.83908 47.8883 2.61768 48.6638 3.55566 49.1993C4.49363 49.7349 5.55721 50.0112 6.63725 50H50.3623C51.4414 50.0103 52.504 49.7336 53.441 49.1981C54.378 48.6626 55.1558 47.8876 55.6948 46.9525C56.2212 46.0532 56.4991 45.0302 56.4999 43.9882C56.5008 42.9462 56.2247 41.9227 55.6998 41.0225ZM52.2323 44.95C52.0417 45.2751 51.768 45.5437 51.4394 45.7282C51.1108 45.9127 50.7391 46.0065 50.3623 46H6.63725C6.26044 46.0065 5.88868 45.9127 5.56008 45.7282C5.23147 45.5437 4.95784 45.2751 4.76725 44.95C4.59461 44.6577 4.50355 44.3245 4.50355 43.985C4.50355 43.6455 4.59461 43.3123 4.76725 43.02L26.6298 5.05251C26.8242 4.72894 27.0991 4.4612 27.4276 4.27532C27.7562 4.08944 28.1273 3.99175 28.5048 3.99175C28.8822 3.99175 29.2533 4.08944 29.5819 4.27532C29.9104 4.4612 30.1853 4.72894 30.3798 5.05251L52.2423 43.02C52.4134 43.3132 52.5027 43.6469 52.501 43.9864C52.4992 44.3258 52.4064 44.6586 52.2323 44.95ZM26.4998 30V20C26.4998 19.4696 26.7105 18.9609 27.0855 18.5858C27.4606 18.2107 27.9693 18 28.4998 18C29.0302 18 29.5389 18.2107 29.914 18.5858C30.289 18.9609 30.4998 19.4696 30.4998 20V30C30.4998 30.5304 30.289 31.0392 29.914 31.4142C29.5389 31.7893 29.0302 32 28.4998 32C27.9693 32 27.4606 31.7893 27.0855 31.4142C26.7105 31.0392 26.4998 30.5304 26.4998 30ZM31.4998 39C31.4998 39.5934 31.3238 40.1734 30.9942 40.6667C30.6645 41.1601 30.196 41.5446 29.6478 41.7716C29.0996 41.9987 28.4964 42.0581 27.9145 41.9424C27.3325 41.8266 26.798 41.5409 26.3784 41.1213C25.9589 40.7018 25.6732 40.1672 25.5574 39.5853C25.4416 39.0033 25.5011 38.4001 25.7281 37.852C25.9552 37.3038 26.3397 36.8352 26.833 36.5056C27.3264 36.176 27.9064 36 28.4998 36C29.2954 36 30.0585 36.3161 30.6211 36.8787C31.1837 37.4413 31.4998 38.2044 31.4998 39Z"
                            fill="#001FCC"
                          />
                        </svg>
                        <div className="text-gray-800 font-medium flex flex-col gap-2 text-center">
                          <span>
                            Are you sure you want to {action} the contact
                            request of{" "}
                            {request.sender.firstName +
                              " " +
                              request.sender.lastName}{" "}
                            {action === "accept" &&
                              "(their contact information would be shared with you as well)"}
                            ?
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            clsBtnRef.current?.click();
                          }}
                          className="border-2 bg-white border-basePrimary text-basePrimary w-full"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            clsBtnRef.current?.click();
                            await onSubmit(
                              request.receiverUserEmail,
                              request.senderUserEmail,
                              request.id
                            );
                          }}
                          className="bg-basePrimary w-full"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <button className="hidden" ref={clsBtnRef}>
                        close
                      </button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserContacts;
