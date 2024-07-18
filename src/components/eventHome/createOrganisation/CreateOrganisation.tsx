"use client"

import { CloseOutline } from "styled-icons/evaicons-outline";
import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
} from "@/components";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "@/schemas";
import { useCreateOrganisation, useGetUserOrganizations } from "@/hooks";
import InputOffsetLabel from "@/components/InputOffsetLabel";

const orgType = ["Private", "Business"];
const pricingPlan = ["Free", "Lite", "Professional", "Business", "Enterprise"];

export function CreateOrganization({ close, refetch }: {refetch?:() => Promise<any>; close: () => void }) {
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
  });
  const { organisation, loading } = useCreateOrganisation();
  const { getOrganizations } = useGetUserOrganizations()

  async function onSubmit(values: z.infer<typeof organizationSchema>) {
    await organisation(values);
    form.reset({
      organizationName: "",
      organizationType: "",
      subscriptionPlan: "",
    });
    getOrganizations()
    if(refetch) refetch()
    close()

  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">
            Create a Workspace
          </h2>
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <InputOffsetLabel label="Name">
                  <Input
                    type="text"
                    placeholder="Enter Workspace Name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="organizationType"
              render={({ field }) => (
                <ReactSelect
                  {...form.register("organizationType")}
                  label="Workspace Type"
                  options={orgType.map((value) => {
                    return { value, label: value };
                  })}
                  placeHolder="Select Workspace"
                />
              )}
            />
            <FormField
              control={form.control}
              name="subscriptionPlan"
              render={({ field }) => (
                <ReactSelect
                  {...form.register("subscriptionPlan")}
                  label="Pricing Plan"
                  options={pricingPlan.map((value) => {
                    return { value, label: value };
                  })}
                  placeHolder="Select Subscription Plan"
                />
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Workspace</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
