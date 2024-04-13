"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { useForgotPassword } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

type FormValue = {
  email: string;
};
export default function Page() {
  const { loading, forgotPassword } = useForgotPassword();
  const form = useForm<FormValue>({});

  async function onSubmit(values: FormValue) {
    await forgotPassword(values.email);
  }

  return (
    <div className="w-full h-full fixed inset-0 ">
        <div className="absolute w-[95%] max-w-xl m-auto h-fit inset-0">
      <div className="w-full mb-6 flex flex-col items-start justify-start gap-y-1">
        <h2 className="font-medium text-lg sm:text-xl text-start">
          Forgot Password
        </h2>
        <p>Enter the email you used for registration.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start w-full flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <InputOffsetLabel label="Email">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                />
              </InputOffsetLabel>
            )}
          />

          <Button
            disabled={loading}
            className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <span>Submit</span>
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
}
