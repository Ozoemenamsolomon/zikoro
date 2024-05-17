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
  useGetOrganizations,
  useGetUserEvents,
  useGetUserTeamOrganizations,
} from "@/hooks";
import { TUser } from "@/types";
import useEventStore from "@/store/globalEventStore";
import { usePathname } from "next/navigation";

const MainTopBar = () => {
  const pathname = usePathname().split("/");
  console.log(pathname);
  const user = getCookie<TUser>("user");
  if (!user) return;

  const { setOrganization } = useOrganizationStore();
  const { setEvent } = useEventStore();

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
    const currentEvent = events?.find(({ id }) => id.toString() === value);
    if (!currentEvent) return;
    setEvent(currentEvent);
  };

  return (
    <header className="border-b p-4 flex justify-between row-reverse">
      <Selector
        options={(userOrganizations ?? [])?.map(({ id, organizationName }) => ({
          label: organizationName,
          value: id.toString(),
        }))}
        onSelect={setCurrentOrganization}
        label="organization"
      />
      {pathname.includes("event") && (
        <Selector
          options={(events ?? [])?.map(({ id, eventTitle }) => ({
            label: eventTitle,
            value: id.toString(),
          }))}
          onSelect={setCurrentEvent}
          label="event"
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
}: {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  label: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : `Select ${label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`enter an ${label}...`} />
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
