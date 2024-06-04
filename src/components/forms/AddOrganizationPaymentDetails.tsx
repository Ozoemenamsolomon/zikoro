"use client";
import React, { useEffect, useRef, useState } from "react";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accountDetailsSchema } from "@/schemas/marketing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DialogClose } from "../ui/dialog";
import { IPayoutAccountDetails, TUser } from "@/types";
import {
  getCookie,
  useGetBanks,
  useGetCountries,
  useResolveAccountNumber,
  useUpdateOrganization,
} from "@/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useUserStore from "@/store/globalUserStore";

export default function AddOrganizationPaymentDetails() {
  const { organization, setOrganization } = useOrganizationStore();
  const { user, setUser } = useUserStore();

  if (!organization || !user) return;

  const { updateOrganization, isLoading: updatingOrganization } =
    useUpdateOrganization({ organizationId: organization?.id });

  console.log(organization?.payoutAccountDetails);
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

  useEffect(() => {
    if (organization?.payoutAccountDetails) {
      form.reset(organization?.payoutAccountDetails);
    } else {
      form.reset({
        bankCountry: "Nigeria",
        currency: "NGN",
        accountNumber: "",
        accountName: "",
        bankName: "",
      });
    }
  }, [organization]);

  const {
    formState: { dirtyFields, errors },
    watch,
    setValue,
  } = form;

  console.log(errors);

  const country = watch("bankCountry");
  const bankName = watch("bankName");
  const bankCode = watch("bankCode");
  const accountNumber = watch("accountNumber");

  const { banks, isLoading: fetchingBanks } = useGetBanks({ country });
  const { countries, isLoading: fetchingCountries } = useGetCountries();
  const { resolveAccountNumber, isLoading: resolvingAccountNumber } =
    useResolveAccountNumber();

  useEffect(() => {
    const countryData =
      countries && countries.find(({ name }) => country === name);

    console.log(countryData, country, "country");

    if (countryData) {
      setValue("currency", countryData.relationships.currency.data[0]);
      setValue("bankCode", "");
    }
  }, [country, countries]);

  useEffect(() => {
    const bankData = banks && banks.find(({ name }) => bankName === name);

    if (!bankData) return;

    setValue("bankCode", bankData.code);
  }, [bankName]);

  useEffect(() => {
    const getAccountNumber = async () => {
      let account = await resolveAccountNumber({
        payload: {
          accountNumber,
          bankCode,
        },
      });
      if (account) {
        setValue("accountName", account.account_name);
      } else {
        setValue("accountName", "");
      }
    };

    console.log(accountNumber.length);
    if (accountNumber && bankCode && accountNumber.length === 10) {
      getAccountNumber();
    }
  }, [accountNumber, bankCode]);

  console.log(banks);
  console.log(countries);

  async function onSubmit(data: IPayoutAccountDetails) {
    const newOrganization = await updateOrganization({
      payload: { ...organization, payoutAccountDetails: data },
    });

    console.log(newOrganization);

    if (newOrganization) {
      setOrganization(newOrganization);
    }
  }

  return (
    <div className="md:pl-8 mt-4 space-y-4">
      <h1 className="md:text-lg text-gray-800 font-bold">
        Organization Account Details
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:w-1/2"
        >
          <FormField
            control={form.control}
            name="bankCountry"
            render={({ field }) => (
              <InputOffsetLabel isRequired label="Bank Country">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={fetchingCountries}>
                      <SelectValue
                        placeholder="Select bank country"
                        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(countries ?? []).map(({ name }) => (
                      <SelectItem value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <InputOffsetLabel isRequired label={"Currency"}>
                <Input
                  placeholder={
                    fetchingCountries ? "fetching countries..." : "currency"
                  }
                  {...field}
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  disabled
                />
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <InputOffsetLabel isRequired label="Bank Name">
                {/* {(() => {
                  console.log(
                    field.value,
                    banks.find((bank) => bank.name === field.value)
                  );

                  return null;
                })()} */}
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between w-full",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={fetchingBanks}
                      >
                        {field.value && banks
                          ? banks.find((bank) => bank.name === field.value)
                              ?.name
                          : "Select bank"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search banks..." />
                      <CommandList>
                        <CommandEmpty>No banks found.</CommandEmpty>
                        <CommandGroup>
                          {(banks ?? []).map(({ name, code }) => (
                            <CommandItem
                              value={name}
                              key={code}
                              onSelect={() => {
                                setValue("bankName", name);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <InputOffsetLabel isRequired label="Account Number">
                <Input
                  disabled={resolvingAccountNumber}
                  placeholder="Enter account number"
                  {...field}
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                />
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <InputOffsetLabel isRequired label={"Account Name"}>
                <Input
                  placeholder={
                    resolvingAccountNumber
                      ? "fetching account information..."
                      : "account name"
                  }
                  {...field}
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  disabled
                />
              </InputOffsetLabel>
            )}
          />
          <Button
            //   disabled={isLoading}
            type="submit"
            className="bg-basePrimary w-full"
          >
            {false ? "Please wait..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
