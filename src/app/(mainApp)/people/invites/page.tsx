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
import { attendeeTypeOptions } from "@/data/attendee";
import {
  useGetEmailInvites,
  useInviteAttendees,
} from "@/hooks/services/attendee";
import { TInviteDetails } from "@/types/attendee";
import {
  calculateAndSetMaxHeight,
  generateAlphanumericHash,
} from "@/utils/helpers";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { Calendar, Copy } from "styled-icons/boxicons-regular";
import { PlusCircleOutline } from "styled-icons/evaicons-outline";
import { Users } from "styled-icons/heroicons-outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TFilter } from "@/types/filter";
import { useFilter } from "@/hooks/common/useFilter";
import Filter from "@/components/Filter";

type TInviteDetail = {
  email: string;
  attendeeType: string;
  created_at?: string;
};


export default function Page() {
  const inviteesFilters: TFilter<TInviteDetail>[] = [
    {
      label: "date",
      accessor: "created_at",
      type: "dateRange",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M5.33333 8.32312L8.162 11.1518L13.818 5.49512M2 8.32312L4.82867 11.1518M10.4853 5.49512L8.33333 7.66645"
            stroke="#CFCFCF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "date",
      accessor: "created_ate",
      type: "dateRange",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M5.33333 8.32312L8.162 11.1518L13.818 5.49512M2 8.32312L4.82867 11.1518M10.4853 5.49512L8.33333 7.66645"
            stroke="#CFCFCF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];
  const [invitees, setInvitees] = useState<Record<string, TInviteDetails>>({
    [generateAlphanumericHash(5)]: {
      email: "",
      attendeeType: "",
    },
  });

  const [message, setMessage] = useState<string>();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const { emailInvites, isLoading, getEmailInvites } = useGetEmailInvites();
  const data = !!emailInvites
    ? emailInvites.flatMap(({ InviteDetails, created_at }) =>
        InviteDetails.map((invitee) => ({ ...invitee, created_at }))
      )
    : [];

  // const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
  //   useFilter<TInviteDetail>({
  //     data: [],
  //     dataFilters: inviteesFilters,
  //   });

  const divRef = useRef<HTMLDivElement>();

  const { inviteAttendees } = useInviteAttendees();
  async function onSubmit(e) {
    e.preventDefault();
    await inviteAttendees({
      payload: {
        Message: message,
        InviteDetails: Object.entries(invitees).map(([key, value]) => value),
        eventName: "event",
        eventId: 1234567890,
      },
    });
    await getEmailInvites();
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

  const deleteInvitee = (key: string) => {
    setInvitees((prevInvitees) => {
      // Create a new object without the specified property
      const {
        [key]: { email, attendeeType },
        ...newInvitees
      } = prevInvitees;
      console.log("deleting key", key);
      console.log("Updated invitees:", newInvitees);
      return newInvitees;
    });
  };

  useEffect(() => {
    calculateAndSetMaxHeight(divRef);
  }, [invitees]);

  return (
    <section className="pt-2 pb-8 border-t-[1px] border-[#F3F3F3]">
      <div className="space-y-6">
        <h1 className="px-2 text-gray-900 text-lg font-medium">Invite</h1>
        <div className="grid grid-cols-3 gap-4 px-2">
          <div className="col-span-2 space-y-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
                <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Share link
                </span>
                <span>www.zikoro.com/events/1?source=link</span>
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
                      copyToClipboard("www.zikoro.com/events/1?source=link")
                    }
                  >
                    <Copy className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>
              <span className="text-tiny text-gray-600">
                Share your link with as many people as you want to invite to
                your event.
              </span>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <h1 className="text-gray-900 text-lg font-medium">
                Invite by email
              </h1>
              <div className="space-y-4">
                {Object.entries(invitees).map(
                  ([key, { email, attendeeType }], index) => (
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6 w-full rounded-md bg-background text-sm relative">
                        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Email
                        </span>
                        <Input
                          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                          onInput={(e) =>
                            updateInvitee(key, { email: e.target.value })
                          }
                          placeholder="Enter invitee email"
                          required
                        />
                      </div>
                      <div className="col-span-5 w-full rounded-md bg-background text-sm relative">
                        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Attendee Type
                        </span>
                        <Select
                          onValueChange={(value) =>
                            updateInvitee(key, { attendeeType: value })
                          }
                          defaultValue={"attendee"}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue
                              className="text-sm text-gray-200"
                              placeholder="select Attendee type"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {attendeeTypeOptions.map(({ label, value }) => (
                              <SelectItem
                                className="text-gray-700"
                                key={label}
                                value={value}
                              >
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => deleteInvitee(key)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M8 11C7.73478 11 7.48043 11.1054 7.29289 11.2929C7.10536 11.4804 7 11.7348 7 12C7 12.2652 7.10536 12.5196 7.29289 12.7071C7.48043 12.8946 7.73478 13 8 13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12C17 11.7348 16.8946 11.4804 16.7071 11.2929C16.5196 11.1054 16.2652 11 16 11H8Z"
                              fill="#CFCFCF"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M23 12C23 18.075 18.075 23 12 23C5.925 23 1 18.075 1 12C1 5.925 5.925 1 12 1C18.075 1 23 5.925 23 12ZM21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                              fill="#CFCFCF"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )
                )}
                <button
                  type="button"
                  onClick={createNewInvitee}
                  className="flex gap-2 font-medium items-center text-basePrimary"
                >
                  <PlusCircleOutline className="w-5 h-5" />
                  <span className="text-sm">invite</span>
                </button>
              </div>
              <div className="w-full rounded-md bg-background text-sm relative">
                <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Message
                </span>
                <Textarea
                  value={message}
                  onInput={(e) => setMessage(e.target.value)}
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  placeholder="Enter message"
                  required
                />
              </div>
              <Button type="submit" className="bg-basePrimary">
                Send Invitation
              </Button>
            </form>
          </div>
          {/* <Tabs defaultValue="link" className="bg-basebody rounded-sm w-full">
            <TabsList className="bg-transparent flex w-full !p-0">
              <TabsTrigger
                className="flex-1 bg-white data-[state=active]:shadow-none px-4 data-[state=active]:bg-basePrimary/20 border-2 data-[state=active]:border-basePrimary data-[state=active]:text-basePrimary rounded-none"
                value="link"
              >
                Link
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 bg-white data-[state=active]:shadow-none px-4 data-[state=active]:bg-basePrimary/20 border-2 data-[state=active]:border-basePrimary data-[state=active]:text-basePrimary rounded-none"
                value="email"
              >
                Email
              </TabsTrigger>
            </TabsList>
            <div className="space-y-2 border-b-2 p-2">
              <h2 className="text-gray-700 font-medium">Email Invites</h2>
              <div className="flex gap-4 items-center text-gray-500 text-sm">
                <Users className="w-5 h-5" />
                <span>20/450 Invites pending</span>
              </div>
              <div className="text-gray-300 flex justify-between text-sm">
                <Filter
                  filters={filters}
                  applyFilter={applyFilter}
                  selectedFilters={selectedFilters}
                />
                <div>
                  <Input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent border-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
            <div
              className="p-2 flex flex-col gap-6 overflow-auto hide-scrollbar"
              ref={divRef}
            >
              <TabsContent value="link">
                {!isLoading &&
                  filteredData.map(({ email, attendeeType }) => (
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                        YB
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{email}</span>
                        <div className="flex gap-4 text-xs items-center">
                          <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                            {attendeeType}
                          </span>
                          <span className="text-yellow-500">Pending</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="invoices">
                Change your password here.
              </TabsContent>
            </div>
          </Tabs> */}
        </div>
      </div>
    </section>
  );
}
