import React, { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { ExternalLink } from "styled-icons/feather";
import {
  getCookie,
  useCheckTeamMember,
  useGetOrganizations,
  useGetUserEvents,
  useGetUserTeamOrganizations,
  useVerifyUserAccess,
} from "@/hooks";
import { TAttendee, TOrganization, TUser } from "@/types";
import useEventStore from "@/store/globalEventStore";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon } from "@/constants";
import useUserStore from "@/store/globalUserStore";
import { useGetData } from "@/hooks/services/request";

const MainTopBar = ({
  eventId,
  userOrganizations,
}: {
  eventId: string;
  userOrganizations: TOrganization[];
}) => {
  const router = useRouter();
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const pathname = usePathname().split("/");
  const { organization, setOrganization } = useOrganizationStore();
  const { event, setEvent } = useEventStore();
  // console.log(pathname);
  const { user, setUser } = useUserStore();
  if (!user) return;

 
  // console.log(event);

  // const {
  //   data: attendee,
  //   isLoading,
  //   getData,
  // } = useGetData<TAttendee>(
  //   `/attendees/email/${user?.userEmail}?eventId=${eventId}`
  // );

  // useEffect(() => {
  //   getData();
  // }, [eventId]);

  const {
    events,
    isLoading: eventIsLoading,
    getUserEvents,
  } = useGetUserEvents({
    userId: user.id,
    organisationId: organization?.id ?? 0,
  });

  const setCurrentOrganization = (value: string) => {
    const currentOrganization = userOrganizations?.find(
      ({ id }) => id.toString() === value
    );

    if (!currentOrganization) return;
    setOrganization(currentOrganization);
  };

  const setCurrentEvent = (value: string) => {
    const currentEvent = events?.find(({ eventAlias }) => eventAlias === value);
    if (!currentEvent) return;
    setEvent(currentEvent);
    router.push(`/event/${currentEvent.eventAlias}/reception`);
  };

  if (pathname.includes("home") || pathname.includes("referrals")) return;

  return (
    <header
      className={cn(
        "border-b w-full p-4 items-center flex justify-between ",
        pathname.includes("events") && "hidden"
      )}
    >
      {pathname.includes("event") ? (
        <>
          {isIdPresent || isOrganizer ? (
            <div className="flex items-center gap-x-2">
              <Selector
                heading={"Your Workspaces"}
                options={(events ?? [])?.map(({ eventAlias, eventTitle }) => ({
                  label: eventTitle,
                  value: eventAlias,
                }))}
                onSelect={setCurrentEvent}
                label="event"
                initialValue={
                  event && {
                    label: event.eventTitle,
                    value: event.eventAlias,
                  }
                }
              />
              <button
                onClick={() => {
                  window.open(`/live-events/${eventId}`);
                }}
                className="text-zinc-700 mb-1"
              >
                <ExternalLink size={20} />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center pb-[0.31rem] pt-[0.4rem] gap-x-3">
                <h2 className="text-base sm:text-xl  max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden sm:w-fit  font-semibold">
                  {event?.eventTitle ?? ""}
                </h2>

                <p className="text-basePrimary bg-basePrimary/20 px-2 flex items-center justify-center py-1 rounded-3xl text-sm">
                  {event?.locationType ?? ""}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div></div>
      )}

      {/* {pathname.includes("event") && !isLoading && attendee && (
        <Link
          className="block sm:hidden"
          href={`/event/${event?.eventAlias}/people/info/${attendee.attendeeAlias}`}
        >
          <UserIcon color="#717171" />
        </Link>
      )} */}

      {!pathname.includes("event") && (
        <Selector
          heading={"Your Events"}
          options={(userOrganizations ?? [])?.map(
            ({ id, organizationName }) => ({
              label: organizationName,
              value: id.toString(),
            })
          )}
          onSelect={setCurrentOrganization}
          label="workspace"
          initialValue={
            organization && {
              label: organization.organizationName,
              value: organization.id.toString(),
            }
          }
        />
      )}
    </header>
  );
};

export default MainTopBar;

export function Selector({
  options,
  onSelect,
  label,
  initialValue,
  heading,
}: {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  label: string;
  initialValue?: { label: string; value: string } | null;
  heading: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue?.value || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between border-none"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : `Select ${label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`enter ${label}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={heading}>
              {Array.isArray(options) &&
                options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue);
                      onSelect(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
