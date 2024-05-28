"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { loginSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Eye } from "styled-icons/feather";
import { EyeOff } from "styled-icons/feather";
import { useLogin } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, logIn } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await logIn(values);
  }

  return (
    <>
      <h2 className="font-medium text-lg sm:text-xl mb-6">Welcome back 👋</h2>

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
          <Link
            href="/forgot-password"
            className="text-basePrimary font-medium"
          >
            Forgot Password?
          </Link>
          <Button
            disabled={loading}
            className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <span>Sign In</span>
          </Button>

          <div className="w-full flex items-center gap-x-1 justify-center">
            <p>Don't have an account yet?</p>
            <Link href="/register" className="text-basePrimary font-medium">
              Create an account
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
}
