"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { attendeeTypeOptions } from "@/data/attendee";
import { useInviteAttendees } from "@/hooks/services/attendee";
import { TInviteDetails } from "@/types/attendee";
import { generateAlphanumericHash } from "@/utils/helpers";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useState } from "react";
import { Calendar, Copy } from "styled-icons/boxicons-regular";
import { PlusCircleOutline } from "styled-icons/evaicons-outline";
import { Users } from "styled-icons/heroicons-outline";

export default function Page() {
  const [invitees, setInvitees] = useState<Record<string, TInviteDetails>>({
    [generateAlphanumericHash(5)]: {
      email: "",
      attendeeType: "",
    },
  });

  const [message, setMessage] = useState<string>();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const { inviteAttendees } = useInviteAttendees();

  async function onSubmit(e) {
    e.preventDefault();
    inviteAttendees({
      payload: {
        Message: message,
        InviteDetails: invitees,
        eventName: "event",
        eventId: 1234567890,
      },
    });
  }

  const updateInvitee = (key: string, newVal: Partial<TInviteDetails>) => {
    console.log(newVal);
    setInvitees((prevInvitees) => {
      const prevVal = prevInvitees[key];
      return { ...prevInvitees, [key]: { ...prevVal, ...newVal } };
    });
  };

  const createNewInvitee = () => {
    console.log("create new invitees");
    setInvitees((prevInvitees) => {
      const key = generateAlphanumericHash(5);
      return {
        ...prevInvitees,
        [key]: {
          email: "",
          attendeeType: "",
        },
      };
    });
  };

  return (
    <section className="px-8 pt-2 pb-8">
      <div className="border-[1px] p-2 space-y-6">
        <h1 className="text-gray-900 text-lg font-medium">Invite</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
                <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Share link
                </span>
                <span>www.zikoro.com/orthoex/event3502/invite.com</span>
                {hasCopiedText ? (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1.25em"
                    width="1.25em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.394 13.742L7.137 17.362 14.753 8.658 13.247 7.342 6.863 14.638 3.606 12.152zM21.753 8.658L20.247 7.342 13.878 14.621 13.125 14.019 11.875 15.581 14.122 17.379z" />
                  </svg>
                ) : (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "www.zikoro.com/orthoex/event3502/invite.com"
                      )
                    }
                  >
                    <Copy className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>
              <span className="text-sm">
                Share your link with as many people as you want to invite to
                your event.
              </span>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <h1 className="text-gray-900 text-lg font-medium">
                Invite by email
              </h1>
              <div className="space-y-2">
                {Object.entries(invitees).map(
                  ([key, { email, attendeeType }]) => (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full rounded-md bg-background text-sm relative">
                        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Email
                        </span>
                        <Input
                          // value={email}
                          onInput={(e) =>
                            updateInvitee(key, { email: e.target.value })
                          }
                          placeholder="Enter invitee email"
                          required
                        />
                      </div>
                      <div className="w-full rounded-md bg-background text-sm relative">
                        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Attendee Type
                        </span>
                        <Select
                          // defaultValue={attendeeType}
                          onValueChange={(value) =>
                            updateInvitee(key, { attendeeType: value })
                          }
                          required
                        >
                          <SelectTrigger className="text-gray-500">
                            <SelectValue placeholder="select Attendee type" />
                          </SelectTrigger>
                          <SelectContent>
                            {attendeeTypeOptions.map(({ label, value }) => (
                              <SelectItem key={label} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                )}
                <button
                  type="button"
                  onClick={createNewInvitee}
                  className="flex gap-2 font-medium items-center text-basePrimary"
                >
                  <PlusCircleOutline className="w-5 h-5" />
                  <span className="text-sm">Add new</span>
                </button>
              </div>
              <div className="w-full rounded-md bg-background text-sm relative">
                <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Message
                </span>
                <Textarea
                  value={message}
                  onInput={(e) => setMessage(e.target.value)}
                  placeholder="Enter message"
                  required
                />
              </div>
              <Button type="submit" className="bg-basePrimary">
                Send Invitation
              </Button>
            </form>
          </div>
          <div className="bg-basebody rounded-sm">
            <div className="space-y-2 border-b-2 p-2">
              <h2 className="text-gray-700 font-medium">Email Invites</h2>
              <div className="flex gap-4 items-center text-gray-500 text-sm">
                <Users className="w-5 h-5" />
                <span>20/450 Invites pending</span>
              </div>
              <div className="text-gray-300 flex justify-between text-sm">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-0.5 items-center">
                    <Calendar className="w-5 h-5" />
                    <span>Date</span>
                  </div>
                  <div className="h-5 w-[3px] bg-gray-300" />
                  <div className="flex gap-0.5 items-center border-r-1 border-gray-400 pr-2">
                    <Users className="w-5 h-5" />
                    <span>Attendees</span>
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent border-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
            <div className="p-2 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    ubahyusuf484@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Speaker
                    </span>
                    <span className="text-yellow-500">Pending</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    cyrilugoh2121@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Speaker
                    </span>
                    <span className="text-yellow-500">Pending</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    davidudem64@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Attendee
                    </span>
                    <span className="text-green-500">Registered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    bilalyusufubah@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Speaker
                    </span>
                    <span className="text-yellow-500">Registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
