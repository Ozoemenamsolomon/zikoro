"use client";

import { useForm } from "react-hook-form";
import { SideBarLayout } from "..";
import { Button, Form, FormControl, FormField, FormItem, Input } from "..";
import { HeaderTab } from "./_components";
import { Search } from "@styled-icons/evil/Search";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { usePartnersTab } from "@/context";
import { PartnersEnum } from "@/types";
import { Sponsors } from "./sponsors/Sponsors";

export function Partners() {
  const form = useForm();
  const { active } = usePartnersTab();
  return (
    <SideBarLayout
    className="px-0 sm:px-0"
    >
      <HeaderTab />

      <div className="w-full flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-x-2">
          <Form {...form}>
            <form className="w-fit">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-96 h-12">
                        <Search size={22} className="absolute top-3 left-2" />
                        <Input
                          type="search"
                          placeholder="search sponsor"
                          {...field}
                          className=" placeholder:text-sm h-12 pr-4 pl-10 w-96  focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium">
            <PlusCircle size={22} />
            <p>Partner</p>
          </Button>
        </div>
      </div>

      {active === PartnersEnum.SPONSORS_TAB && <Sponsors />}
      {active === PartnersEnum.EXHIBITORS_TAB && (
        <div className="w-full flex items-center justify-center h-80">
          <p className="font-semibold text-xl text-red-500">
            OOPS! NO EXHIBITOR
          </p>
        </div>
      )}
    </SideBarLayout>
  );
}
