"use client";

import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Button,
} from "@/components";

export function Sponsors() {
  const form = useForm();

  function onSubmit() {}
  return (
    <div>
      <div className="w-full items-end justify-end flex py-6">
        <div className="flex items-center gap-x-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-80 h-12">
                        <Input
                          type="search"
                          placeholder="Search Sponsors"
                          {...field}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
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
            <p>Partners</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
