"use client";

import { useGetUserOrganizations, saveCookie, getCookie } from "@/hooks";
import { PlusCircle } from "styled-icons/bootstrap";
import { useState, useMemo, useEffect } from "react";
import { OrganizationIcon } from "@/constants";
import { Button, Form, ReactSelect } from "@/components";
import { CreateOrganization } from "..";
import { useParams, useRouter } from "next/navigation";
import _ from "lodash";
import { useForm } from "react-hook-form";
import useOrganizationStore from "@/store/globalOrganizationStore";
import useUserStore from "@/store/globalUserStore";


type OrganizationListType = {
  label: string;
  value: any;
};
export function HeaderWidget({
  currentQuery,
}: {
  currentQuery: string | null;
}) {
  const [isOpen, setOpen] = useState(false);
  const {user} = useUserStore()
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      org: "",
    },
  });
  const { id } = useParams();
  const { organizations: organizationList } = useGetUserOrganizations();

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

  const { setOrganization } = useOrganizationStore();
  const selectedOrg = form.watch("org");
  useEffect(() => {
    if (selectedOrg) {
      const org = organizationList.find(
        (o) => String(o.id) === String(selectedOrg)
      );

      if (!org) return;
      setOrganization(org);
      saveCookie("currentOrganization", {
        id: org?.id,
        name: org?.organizationName,
        plan: org?.subscriptionPlan,
        email: org?.eventContactEmail,
      });
      router.push(`/events/${org?.id}?organization=${org?.organizationName}`);
    } else if (Array.isArray(formattedList) && formattedList?.length > 0) {
      const org = organizationList.find(
        (o) => String(o.id) === String(formattedList[0]?.value)
      );
      saveCookie("currentOrganization", {
        id: org?.id,
        name: org?.organizationName,
        plan: org?.subscriptionPlan,
        email: org?.eventContactEmail,
      });
    }
  }, [selectedOrg, formattedList]);

  function newEvent() {
    router.push(`/create`);
  }

  return (
    <div className="z-[50]">
      <div className="w-full mb-4 sm:mb-6 items-start flex-col gap-y-2 sm:items-center sm:flex-row sm:justify-between justify-start flex">
        <div className="flex flex-col gap-y-2 items-start justify-start">
          <h2 className="font-semibold capitalize text-base sm:text-2xl">
            {`Welcome, ${user?.firstName ?? "User"}`}
          </h2>
          <p className="text-gray-500"></p>
        </div>
        <div className="flex w-full sm:w-fit items-center gap-x-3">
          <Form {...form}>
            <form
              className="w-[60%] sm:w-[180px]"
              //  onSubmit={form.handleSubmit(showOrganizationEvents)}
            >
              {Array.isArray(formattedList) && formattedList?.length > 0 && (
                <ReactSelect
                  {...form.register("org")}
                  defaultValue={
                    currentQuery
                      ? { label: currentQuery, value: id }
                      : {
                          label: formattedList[0]?.label,
                          value: formattedList[0]?.value,
                        }
                  }
                  options={formattedList}
                  borderColor="#001fcc"
                  bgColor="#001fcc1a"
                 // height="3rem"
                  placeHolderColor="#64748b"
                  placeHolder="Select Organization"
                />
              )}
            </form>
          </Form>

          <div className="flex items-center gap-x-3 sm:gap-x-2">
            <Button
              onClick={onClose}
              className="hidden sm:flex bg-transparent border text-basePrimary hover:border-0 border-basePrimary transition-all transform duration-300 ease-in-out hover:text-gray-50 hover:bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
            >
              <PlusCircle size={22} />
              <p>Workspace</p>
            </Button>

            <Button
              onClick={newEvent}
              className="text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
            >
              <PlusCircle size={22} />
              <p>Event</p>
            </Button>
            <button className="block sm:hidden" onClick={onClose}>
              {" "}
              <OrganizationIcon color={"#000000"} />
            </button>
          </div>
        </div>
      </div>
      {isOpen && <CreateOrganization close={onClose} />}
    </div>
  );
}
