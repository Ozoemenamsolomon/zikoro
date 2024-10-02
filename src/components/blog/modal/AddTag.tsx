"use client";
import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { ArrowBackOutline } from "styled-icons/evaicons-outline";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  // useCreateEventIndustry,
  useFetchBlogTags,
  useCreateBlogTag,
} from "@/hooks/services/post";

type FormValue = {
  name: string;
};

export function AddTag({
  updateTags,
  initialTags,
}: {
  updateTags?: (tags: string[]) => void;
  initialTags?: string[];

}) {
  const form = useForm<FormValue>();
  const { data, refetch } = useFetchBlogTags();
  const { createBlogTag } = useCreateBlogTag();
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<{ tagName: string }[]>([]);

  async function onSubmit(value: FormValue) {
    if (value.name === undefined || "") {
      toast.error("Please enter a valid tag name");
      setLoading(true);
      return;
    }

    await createBlogTag(value?.name);
    form.reset({
      name: "",
    });
    refetch();
    setLoading(false);
    
  }

  function handleTagClick(tag: string) {
    if (!allTags.some((t) => t.tagName === tag)) {
      setAllTags((prevTags) => [...prevTags, { tagName: tag }]);
      toast(`${tag} added.`);
    } else {
      setAllTags((prevTags) => prevTags.filter((t) => t.tagName !== tag));
      toast.error(`Tag "${tag}" removed.`);
    }
  }

  useEffect(() => {
    if (initialTags) {
      setAllTags(initialTags.map(tag => ({ tagName: tag })));
    }
  }, [initialTags]);

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-8 px-3 sm:px-6"
      >
        <div className="w-full flex items-center gap-x-2">
          <Button
            onClick={() => {
              if (updateTags) {
                updateTags(allTags.map(({ tagName }) => tagName))
              }
            }}
            className="px-1 h-fit w-fit"
          >
            <ArrowBackOutline size={22} />
          </Button>
          <h2 className="font-medium text-lg sm:text-xl">Create New Tag</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <InputOffsetLabel label="Tag Name">
                  <Input
                    type="text"
                    placeholder="Tag"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            {/** */}
            {Array.isArray(data) && data?.length > 0 && (
              <div className="w-full flex flex-col gap-y-4 items-start justify-start">
                <h3 className="mt-2">Existing Tags</h3>

                <div className="w-full grid grid-cols-4 lg:grid-cols-5 items-center gap-4">
                  {Array.isArray(data) &&
                    data.map(({ blogTag }, index) => {
                      const isSelected = allTags.some(
                        (t) => t.tagName === blogTag
                      );

                      return (
                        <p
                          onClick={() => handleTagClick(blogTag)}
                          className={`p-2 cursor-pointer border-[1px] rounded-lg font-medium capitalize text-base ${
                            isSelected
                              ? "bg-basePrimary text-white"
                              : "bg-white text-black"
                          }`}
                          key={index}
                        >
                          {blogTag}
                        </p>
                      );
                    })}
                </div>
                {allTags.length > 0 && (
                  <>
                    <h3 className="mt-2">Selected Tags</h3>

                    <div className="w-full grid grid-cols-4 lg:grid-cols-5 items-center gap-4">
                      {Array.isArray(allTags) &&
                        allTags.map(({ tagName }, i) => {
                          return (
                            <p
                              className="p-2 cursor-pointer border-[1px] rounded-lg font-medium capitalize text-base bg-basePrimary text-white"
                              key={i}
                            >
                              {tagName}
                            </p>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 h-12 w-full gap-x-2 bg-basePrimary text-gray-50 font-medium"
            >
              <span>Create Tag</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

