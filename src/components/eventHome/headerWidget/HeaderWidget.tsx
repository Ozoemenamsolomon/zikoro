"use client";

import { useGetQueries } from "@/hooks";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useState, useMemo, useEffect } from "react";

import {
  Button,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Form,
  ReactSelect,
} from "@/components";
import { CreateOrganization } from "..";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { useForm } from "react-hook-form";

type OrganizationListType = {
  label: string;
  value: string;
};
export function HeaderWidget({
  currentQuery,
}: {
  currentQuery: string | null;
}) {
  const [organization, setOrganization] = useState(currentQuery ?? "");
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm({});
  const { data: organizationList } = useGetQueries("organization");

  function onClose() {
    setOpen(!isOpen);
  }

  const formattedList: OrganizationListType[] = useMemo(() => {
    const restructuredList = organizationList?.map(
      ({ id, organizationName }) => {
        return { label: id, value: organizationName };
      }
    );
    return _.uniqBy(restructuredList, "value");
  }, [organizationList]);

  function showOrganizationEvents(value: any) {
   
    const org = formattedList.find((o) => o.value === value.value);
    router.push(`/events/${org?.label}?organization=${value.value}`);
  }

  function newEvent() {
    const org = formattedList.find((o) => o.value === organization);
    router.push(`/create/${org?.label}`);
  }

  return (
    <div>
      <div className="w-full mb-4 sm:mb-6 items-start flex-col gap-y-2 sm:items-center sm:flex-row sm:justify-between justify-start flex">
        <div className="flex flex-col gap-y-2 items-start justify-start">
          <h2 className="font-semibold text-base sm:text-2xl">
            {`Welcome, User`}
          </h2>
          <p className="text-gray-500"></p>
        </div>
        <div className="flex items-center gap-x-3">
          <Form {...form}>
            <form className="w-[150px]" onSubmit={form.handleSubmit(showOrganizationEvents)}>
              <ReactSelect
                {...form.register("org")}
                options={formattedList}
                placeHolder="Select Organization"
              />
            </form>
          </Form>
         
          <Button
            onClick={onClose}
            className="bg-transparent border text-zikoro hover:border-0 border-zikoro transition-all transform duration-300 ease-in-out hover:text-gray-50 hover:bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
          >
            <PlusCircle size={22} />
            <p>Organization</p>
          </Button>
          <Button
            onClick={newEvent}
            className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
          >
            <PlusCircle size={22} />
            <p>Event</p>
          </Button>
        </div>
      </div>
      {isOpen && <CreateOrganization close={onClose} />}
    </div>
  );
}
