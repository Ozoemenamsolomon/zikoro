import { DialogClose } from "../ui/dialog";
import React from "react";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAffiliate } from "@/hooks/services/marketing";
import { AffiliateSchema } from "@/schemas/marketing";
import { TAffiliate } from "@/types/marketing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
export default function CreateAffiliateForm() {
  const defaultValues: Partial<TAffiliate> = {
    organizationId: 4,
    organizationName: "CNT",
    userEmail: "kachiozo@gmail.com",
    userId: 2,
    accountDetails: {
      bankCountry: "Nigeria",
      currency: "NGN",
      accountNumber: "",
      accountName: "",
      bankName: "",
    },
    affliateStatus: true,
  };

  const { createAffiliate, isLoading } = useCreateAffiliate();

  const form = useForm<TAffiliate>({
    resolver: zodResolver(AffiliateSchema),
    defaultValues,
  });

  async function onSubmit(payload: TAffiliate) {
    console.log(payload);

    await createAffiliate({ payload });
  }

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
                <InputOffsetLabel isRequired label={"Phone Number"}>
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
              name="accountDetails.bankCounty"
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
              name="accountDetails.currency"
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
              name="accountDetails.accountNumber"
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
              name="accountDetails.accountName"
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
          name="accountDetails.bankName"
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
        <DialogClose asChild>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-basePrimary w-full"
          >
            {isLoading ? "Please wait..." : "Create"}
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
