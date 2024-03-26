"use client";

import { useGetQueries, saveCookie } from "@/hooks";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useState, useMemo, useEffect } from "react";

import {
  Button,
  Form,
  ReactSelect,
} from "@/components";
import { CreateOrganization } from "..";
import { useParams, useRouter } from "next/navigation";
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
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      org:""
    }
  });
  const { id } = useParams();
  const { data: organizationList } = useGetQueries("organization");

  function onClose() {
    setOpen(!isOpen);
  }

  const formattedList: OrganizationListType[] = useMemo(() => {
    const restructuredList = organizationList?.map(
      ({ id, organizationName }) => {
        return { value: id, label: organizationName };
      }
    );
    return _.uniqBy(restructuredList, "value");
  }, [organizationList]);

  const selectedOrg = form.watch("org");
  useEffect(() => {
    if (selectedOrg) {
      const org = organizationList.find((o) => o.id === selectedOrg);
      saveCookie("currentOrganization", {
        id: org?.id,
        name: org?.organizationName,
        plan: org?.subscriptionPlan,
      });
      router.push(`/events/${org?.id}?organization=${org?.organizationName}`);
    }
  }, [selectedOrg]);

  function newEvent() {
    const org = formattedList.find((o) => o.label === currentQuery);
    router.push(`/create/${org?.value}`);
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
            <form
              className="w-[180px]"
              //  onSubmit={form.handleSubmit(showOrganizationEvents)}
            >
              <ReactSelect
                {...form.register("org")}
                defaultValue={{ label: currentQuery, value: id } || ""}
                options={formattedList}
                placeHolder="Select Organization"
              />
            </form>
          </Form>

          <Button
            onClick={onClose}
            className="bg-transparent border text-basePrimary hover:border-0 border-basePrimary transition-all transform duration-300 ease-in-out hover:text-gray-50 hover:bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
          >
            <PlusCircle size={22} />
            <p>Organization</p>
          </Button>
          <Button
            onClick={newEvent}
            className="text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
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
