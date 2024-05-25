import React from "react";
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
import {
  getCookie,
  useCheckTeamMember,
  useGetOrganizations,
  useGetUserEvents,
  useGetUserTeamOrganizations,
  useVerifyUserAccess,
} from "@/hooks";
import { TUser } from "@/types";
import useEventStore from "@/store/globalEventStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon } from "@/constants";

const MainTopBar = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const pathname = usePathname().split("/");

  // console.log(pathname);
  const user = getCookie<TUser>("user");
  if (!user) return;

  const { organization, setOrganization } = useOrganizationStore();
  const { event, setEvent } = useEventStore();

  // console.log(event);

  const {
    userOrganizations,
    isLoading: organizationIsLoading,
    getUserOrganizations,
  } = useGetUserTeamOrganizations({ userEmail: user.userEmail });

  const {
    events,
    isLoading: eventIsLoading,
    getUserEvents,
  } = useGetUserEvents({ userId: user.id });

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
    router.push(`/event/${currentEvent.eventAlias}/content/info`);
  };

  return (
    <header className="border-b w-full p-4 items-center flex justify-between ">
      {pathname.includes("event") ? (
        <>
          {isIdPresent || isOrganizer ? (
            <Selector
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
          ) : (
            <div>
              <div className="flex items-center gap-x-3">
                <h2 className="text-base sm:text-xl font-semibold">
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

      {pathname.includes("event") && (
        <Link className="block sm:hidden" href="/profile">
          <UserIcon color="#717171" />
        </Link>
      )}

      {!pathname.includes("event") ? (
        <Selector
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
      ) : null}
    </header>
  );
};

export default MainTopBar;

export function Selector({
  options,
  onSelect,
  label,
  initialValue,
}: {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  label: string;
  initialValue?: { label: string; value: string } | null;
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
            <CommandGroup heading="Your Organizations">
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
