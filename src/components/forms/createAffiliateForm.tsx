// import { DialogClose } from "../ui/dialog";
"use client";

import React, { useRef } from "react";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAffiliate } from "@/hooks/services/marketing";
import { AffiliateSchema } from "@/schemas/marketing";
import { TAffiliate } from "@/types/marketing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DialogClose } from "../ui/dialog";
import useEventStore from "@/store/globalEventStore";
import { TUser } from "@/types";
import { getCookie } from "@/hooks";
import { generateAlphanumericHash } from "@/utils/helpers";
import useUserStore from "@/store/globalUserStore";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { Textarea } from "../ui/textarea";

export default function CreateAffiliateForm({
  affiliate,
  getAffiliates,
}: {
  affiliate?: TAffiliate;
  getAffiliates: () => Promise<void>;
}) {
  const currentEvent = useEventStore((state) => state.event);
  const { user, setUser } = useUserStore();
  const { organization } = useOrganizationStore();

  const defaultValues: Partial<TAffiliate> = affiliate || {
    userEmail: user?.userEmail,
    userId: user?.id,
    accountDetails: {
      bankCountry: "Nigeria",
      currency: "NGN",
      accountNumber: "",
      accountName: "",
      bankName: "",
      bankCode: "",
    },
    affliateStatus: true,
    note: "",
    phoneNumber: "",
  };

  const { createAffiliate, isLoading } = useCreateAffiliate();

  const form = useForm<TAffiliate>({
    resolver: zodResolver(AffiliateSchema),
    defaultValues,
  });

  const {
    formState: { dirtyFields, errors },
  } = form;

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: TAffiliate) {
    if (!clsBtnRef.current) return;

    clsBtnRef.current.click();

    const payload = data;

    if (!affiliate) {
      const affliateCode = generateAlphanumericHash(7);
      payload.affliateCode = affliateCode;
    }

    await createAffiliate({
      payload: { ...payload, organizationId: organization?.id ?? 0 },
    });

    await getAffiliates();
  }

  console.log(errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <InputOffsetLabel isRequired label="First Name">
                  <Input
                    placeholder="Enter first name"
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
              name="lastname"
              render={({ field }) => (
                <InputOffsetLabel isRequired label={"Last Name"}>
                  <Input
                    placeholder={"Enter last name"}
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
              name="email"
              render={({ field }) => (
                <InputOffsetLabel isRequired label="Email">
                  <Input
                    placeholder="Enter email"
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
              name="phoneNumber"
              render={({ field }) => (
                <InputOffsetLabel label={"Phone Number"}>
                  <Input
                    placeholder={"Enter phone number"}
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
              name="accountDetails.bankCountry"
              render={({ field }) => (
                <InputOffsetLabel label="Bank Country">
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
              name="accountDetails.currency"
              render={({ field }) => (
                <InputOffsetLabel label={"Currency"}>
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
              name="accountDetails.accountNumber"
              render={({ field }) => (
                <InputOffsetLabel label="Account Number">
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
              name="accountDetails.accountName"
              render={({ field }) => (
                <InputOffsetLabel label={"Account Name"}>
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
          name="accountDetails.bankName"
          render={({ field }) => (
            <InputOffsetLabel label="Bank Name">
              <Input
                placeholder="Enter bank name"
                {...field}
                className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
              />
            </InputOffsetLabel>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <InputOffsetLabel label="Note">
              <Textarea
                placeholder="Enter note"
                {...field}
                className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
              />
            </InputOffsetLabel>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-basePrimary w-full"
        >
          {isLoading ? "Please wait..." : "Create"}
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
