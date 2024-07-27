"use client";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { attendeeTypeOptions } from "@/data/attendee";
import { useFilter } from "@/hooks/common/useFilter";
import TextEditor from "@/components/TextEditor";
import {
  useGetEmailInvites,
  useInviteAttendees,
} from "@/hooks/services/attendee";
import { TInviteDetails } from "@/types/attendee";
import { TFilter } from "@/types/filter";
import {
  calculateAndSetMaxHeight,
  generateAlphanumericHash,
} from "@/utils/helpers";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Copy } from "styled-icons/boxicons-regular";
import { PlusCircleOutline } from "styled-icons/evaicons-outline";
import useEventStore from "@/store/globalEventStore";
import { cn } from "@/lib";

type TInviteDetail = {
  name: string;
  email: string;
  role: string;
};

export default function Page() {
  const router = useRouter();
  const { eventId } = useParams();
  const { event } = useEventStore();
  if (!event) return;
  const [invitees, setInvitees] = useState<Record<string, TInviteDetail>>({
    [generateAlphanumericHash(8)]: {
      name: "",
      email: "",
      role: "attendee",
    },
  });

  const [message, setMessage] = useState<string>(
    `
    ---------------------------------------------------------------------------
<br/>
<br/>
<br/>
Hi there,
<br />
<br />
    here's your link: ${window.location.host}/live-events/${eventId}?source=email
<br/>
<br/>
Yours sincerely,
<br/>
${event?.eventTitle} Organizing Team
<br/>
<br/>
<br/>
    ---------------------------------------------------------------------------
    `
  );

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const divRef = useRef<HTMLDivElement>(null);

  const { inviteAttendees } = useInviteAttendees();
  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    await inviteAttendees({
      payload: {
        message,
        invitees: Object.entries(invitees).map(([key, value]) => ({
          ...value,
          trackingId: key,
        })),
        eventAlias: eventId,
      },
    });
    router.back();
  }

  const updateInvitee = (key: string, newVal: Partial<TInviteDetail>) => {
    setInvitees((prevInvitees) => {
      const prevVal = prevInvitees[key];
      return { ...prevInvitees, [key]: { ...prevVal, ...newVal } };
    });
  };

  const createNewInvitee = () => {
    setInvitees((prevInvitees) => {
      const key = generateAlphanumericHash(8);
      return {
        ...prevInvitees,
        [key]: {
          name: "",
          email: "",
          role: "attendee",
        },
      };
    });
  };

  const deleteInvitee = (key: string) => {
    setInvitees((prevInvitees) => {
      // Create a new object without the specified property
      const {
        [key]: { email, role },
        ...newInvitees
      } = prevInvitees;

      return newInvitees;
    });
  };

  useEffect(() => {
    calculateAndSetMaxHeight(divRef);
  }, [invitees]);

  return (
    <section className="space-y-8 pl-4 pr-8 bg-[#f9faff] py-8 min-h-full">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-8 px-12"
      >
        <div className="p-4 border rounded-md bg-white space-y-2 w-full">
          <h1 className="text-gray-900 font-medium">Invite with Email</h1>
          <div className="space-y-4">
            {Object.entries(invitees).map(
              ([key, { name, email, role }], index) => (
                <div className="grid md:grid-cols-12 gap-4 w-full">
                  <div className="md:col-span-4 w-full rounded-md bg-background text-sm relative">
                    <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      Name
                    </span>
                    <Input
                      className="placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                      onInput={(e) =>
                        updateInvitee(key, { name: e.currentTarget.value })
                      }
                      placeholder="Enter invitee full name"
                      required
                      value={name}
                    />
                  </div>
                  <div className="md:col-span-4 w-full rounded-md bg-background text-sm relative">
                    <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      Email
                    </span>
                    <Input
                      className="placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                      onInput={(e) =>
                        updateInvitee(key, { email: e.currentTarget.value })
                      }
                      placeholder="Enter invitee email"
                      required
                      value={email}
                    />
                  </div>
                  <div
                    className={cn(
                      "w-full rounded-md bg-background text-sm relative",
                      index === 0 ? "md:col-span-4" : "md:col-span-3"
                    )}
                  >
                    <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      Attendee Type
                    </span>
                    <Select
                      onValueChange={(value) =>
                        updateInvitee(key, { role: value })
                      }
                      defaultValue={"attendee"}
                      required
                      value={role}
                    >
                      <SelectTrigger>
                        <SelectValue
                          className="text-tiny md:text-sm text-gray-200"
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
                    <button type="button" onClick={() => deleteInvitee(key)}>
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
        </div>
        <div className="p-4 border rounded-md bg-white space-y-2 w-full">
          <h2 className="text-gray-900  font-medium">Write invite Message</h2>
          <TextEditor
            onChange={setMessage}
            defaultValue={message}
            placeholder="Write message"
          />
        </div>
        <Button type="submit" className="bg-basePrimary self-start">
          Send Invitation
        </Button>
      </form>
      {/* <div className="space-y-4 md:space-y-6">
        <div className="grid md:grid-cols-3 gap-x-4 gap-y-12 px-2">
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <div className="space-y-4 text-gray-700">
              <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm relative">
                <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Share link
                </span>
                <div className="flex gap-2 justify-between items-center overflow-hidden">
                  <span className="truncate text-xs md:text-base">
                    {window.location.host}/live-events/{eventId}?source=link
                  </span>
                  <span className="bg-white h-full flex items-center px-2">
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
                            `${window.location.host}/live-events/${eventId}?source=link`
                          )
                        }
                      >
                        <Copy className="w-5 h-5 text-gray-700" />
                      </button>
                    )}
                  </span>
                </div>
              </div>
              <span className="text-[8px] md:text-tiny text-gray-600">
                Share your link with as many people as you want to invite to
                your event.
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}