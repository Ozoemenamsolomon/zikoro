"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { useState } from "react";
import { Eye } from "@styled-icons/feather/Eye";
import { EyeOff } from "@styled-icons/feather/EyeOff";
import { useUpdatePassword } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

type FormValue = {
  password: string;
};
export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, updatePassword } = useUpdatePassword();
  const form = useForm<FormValue>({});

  async function onSubmit(values: FormValue) {
    await updatePassword(values.password);
  }

  return (
    <div className="w-full h-full fixed inset-0 ">
      <div className="absolute w-[95%] max-w-xl m-auto h-fit inset-0">
        <div className="w-full mb-6 flex flex-col items-start justify-start gap-y-1">
          <h2 className="font-medium text-lg sm:text-xl text-start">
            Reset Password
          </h2>
          <p>Enter a new password.</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <InputOffsetLabel label="New Password">
                  <div className="relative h-12 w-full">
                    <Input
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                      }}
                      className="absolute right-3 inset-y-1/4"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </InputOffsetLabel>
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Reset Password</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
