"use client";

import { useGetQueries } from "@/hooks";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useState, useMemo } from "react";

import {
  Button,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components";
import { CreateOrganization } from "..";
import { useRouter } from "next/navigation";

type OrganizationListType = {
  id: Number;
  value: string;
};
export function HeaderWidget({ currentQuery }: { currentQuery: string | null }) {
  const [organization, setOrganization] = useState(currentQuery ?? "");
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const { data: organizationList } = useGetQueries("organization");

  function onClose() {
    setOpen(!isOpen);
  }

  const formattedList: OrganizationListType[] = useMemo(() => {
    return organizationList?.map(({ id, organizationName }) => {
      return { id, value: organizationName };
    });
  }, [organizationList]);

  console.log({ organization });

  function showOrganizationEvents(value: string) {
    const org = formattedList.find((o) => o.value === value);
    router.push(`/${org?.id}?organization=${value}`);
  }
  return (
    <div>
      <div className="w-full mb-4 sm:mb-6 items-start flex-col gap-y-2 sm:items-center sm:flex-row sm:justify-between justify-start flex">
        <div className="flex flex-col gap-y-2 items-start justify-start">
          <h2 className="font-semibold text-base sm:text-2xl">
            Welcome, Rasheed
          </h2>
          <p className="text-gray-500"></p>
        </div>
        <div className="flex items-center gap-x-3">
          <Select
            onValueChange={(newValue) => {
              showOrganizationEvents(newValue);
              setOrganization(newValue);
              //
            }}
            value={organization}
          >
            <SelectTrigger className="border outline-none max-w-[170px] min-w-[150px] focus:border-gray-300 h-12">
              <SelectValue
                placeholder="Select Organization "
                className="placeholder:text-sm h-12 focus:border-gray-300 outline-none placeholder:text-gray-200 text-gray-700"
              />
            </SelectTrigger>

            <SelectContent>
              {Array.isArray(formattedList) &&
                formattedList?.map(({ value }) => (
                  <SelectItem key={value ?? "Select Organization"} value={value}>
                    {value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onClose}
            className="bg-transparent border text-zikoro hover:border-0 border-zikoro transition-all transform duration-300 ease-in-out hover:text-gray-50 hover:bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
          >
            <PlusCircle size={22} />
            <p>Organization</p>
          </Button>
          <Button className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium">
            <PlusCircle size={22} />
            <p>Event</p>
          </Button>
        </div>
      </div>
      {isOpen && <CreateOrganization close={onClose} />}
    </div>
  );
}
