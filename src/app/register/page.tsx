"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import {  loginSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Eye } from "@styled-icons/feather/Eye";
import { EyeOff } from "@styled-icons/feather/EyeOff";
import { useRegistration } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, register } = useRegistration();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await register(values);
  }

  return (
    <>
      <h2 className="font-medium text-lg sm:text-xl mb-6 text-center w-full">Register</h2>

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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <InputOffsetLabel label="Password">
                <div className="relative h-12 w-full">
                  <Input
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
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
            <span>Sign Up</span>
          </Button>

          <div className="w-full flex items-center gap-x-1 justify-center">
            <p>Already have an account?</p>
            <Link href="/login" className="text-basePrimary font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
}
