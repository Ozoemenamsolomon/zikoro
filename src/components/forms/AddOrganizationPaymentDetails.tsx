// import { DialogClose } from "../ui/dialog";
"use client";

import React, { useRef } from "react";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAffiliate } from "@/hooks/services/marketing";
import { AffiliateSchema, accountDetailsSchema } from "@/schemas/marketing";
import { TAffiliate } from "@/types/marketing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DialogClose } from "../ui/dialog";
import useEventStore from "@/store/globalEventStore";
import { IPayoutAccountDetails, TUser } from "@/types";
import { getCookie, useGetOrganization, useUpdateOrganization } from "@/hooks";
import { generateAlphanumericHash } from "@/utils/helpers";
import useOrganizationStore from "@/store/globalOrganizationStore";

export default function AddOrganizationPaymentDetails() {
  const { organization, setOrganization } = useOrganizationStore();
  const user = getCookie<TUser>("user");

  if (!organization || !user) return;

  const { updateOrganization, isLoading: updatingOrganization } =
    useUpdateOrganization({ organizationId: organization?.id });

  const defaultValues: Partial<IPayoutAccountDetails> =
    organization?.payoutAccountDetails ?? {
      bankCountry: "Nigeria",
      currency: "NGN",
      accountNumber: "",
      accountName: "",
      bankName: "",
    };

  const form = useForm<IPayoutAccountDetails>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues,
  });

  const {
    formState: { dirtyFields, errors },
  } = form;

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: IPayoutAccountDetails) {
    if (!clsBtnRef.current) return;

    clsBtnRef.current.click();

    const newOrganization = await updateOrganization({
      payload: { ...organization, payoutAccountDetails: data },
    });

    console.log(newOrganization);

    if (newOrganization) {
      setOrganization(newOrganization);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="bankCountry"
              render={({ field }) => (
                <InputOffsetLabel isRequired label="Bank Country">
                  <Input
                    placeholder="Enter bank country"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <InputOffsetLabel isRequired label={"Currency"}>
                  <Input
                    placeholder={"Enter currency"}
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <InputOffsetLabel isRequired label="Account Number">
                  <Input
                    placeholder="Enter account number"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <InputOffsetLabel isRequired label={"Account Name"}>
                  <Input
                    placeholder={"Enter account name"}
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <InputOffsetLabel isRequired label="Bank Name">
              <Input
                placeholder="Enter bank name"
                {...field}
                className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
              />
            </InputOffsetLabel>
          )}
        />
        <Button
          //   disabled={isLoading}
          type="submit"
          className="bg-basePrimary w-full"
        >
          {false ? "Please wait..." : "Create"}
        </Button>
        <DialogClose asChild>
          <button className="hidden" ref={clsBtnRef}>
            close
          </button>
        </DialogClose>
      </form>
    </Form>
  );
}
