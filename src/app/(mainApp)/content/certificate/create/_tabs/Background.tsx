import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { TabProps } from "../page";
import { Input } from "@/components/ui/input";
import { calculateAndSetMaxHeight, uploadFile } from "@/utils/helpers";
import {
  useGetOrganization,
  useUpdateOrganization,
} from "@/hooks/services/organization";
import { cn } from "@/lib/utils";
import { useEditor, Element } from "@craftjs/core";

const Background = ({ details, setValue }: TabProps) => {
  const { connectors } = useEditor();
  const {
    organization,
    isLoading: fetching,
    getOrganization,
  } = useGetOrganization({
    organizationId: 5,
  });
  const { updateOrganization, isLoading: updating } = useUpdateOrganization({
    organizationId: 5,
  });

  const divRef = useRef<HTMLDivElement>(null);

  console.log(organization);
  const [backgroundUploading, setBackgroundUploading] =
    useState<boolean>(false);

  const uploadBackground = async (file: File | null) => {
    try {
      if (!file) return;
      setBackgroundUploading(true);
      const { url, error } = await uploadFile(file, "image");

      if (error || !url) throw error;
      alert("File uploaded successfully");

      setValue("background", url);
      const payload = organization?.certificateAsset
        ? {
            certificateAsset: {
              ...organization?.certificateAsset,
              backgrounds: organization?.certificateAsset?.backgrounds
                ? [...organization?.certificateAsset?.backgrounds, url]
                : [url],
            },
          }
        : {
            certificateAsset: {
              backgrounds: [url],
              elements: [],
            },
          };

      // const payload = {
      //   certificateAsset: {
      //     backgrounds: organization?.certificateAsset?.backgrounds,
      //   },
      // };

      await updateOrganization({
        payload,
      });

      await getOrganization();
      console.log("File uploaded successfully!", url);
    } catch (error) {
      alert("error uploading profile picture");
      console.error("Error uploading file:", error);
    } finally {
      setBackgroundUploading(false);
    }
  };

  useEffect(() => {
    if (!divRef) return;
    calculateAndSetMaxHeight(divRef);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 items-center py-4">
        {" "}
        <Button
          disabled={backgroundUploading}
          onClick={() => document.getElementById("file-input")?.click()}
          className="border-basePrimary border-2 text-basePrimary bg-transparent flex gap-4 justify-center items-center rounded-md py-2 px-3"
        >
          {backgroundUploading ? (
            <div className="animate-spin">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
              </svg>
            </div>
          ) : (
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1={12} y1={3} x2={12} y2={15} />
            </svg>
          )}
          <span>Import Background</span>
        </Button>
        <div className="hidden">
          <Input
            id="file-input"
            name="background"
            type="file"
            onChange={(e) =>
              e.currentTarget.files &&
              uploadBackground(e.currentTarget.files[0])
            }
            accept="image/*"
          />
        </div>
        <span className="text-gray-500 text-xs font-medium">
          Upload JPG and PNG not more than 2MB
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 py-4" ref={divRef}>
        {organization?.certificateAsset?.backgrounds &&
          organization?.certificateAsset?.backgrounds.map((url) => (
            <button
              onClick={() => setValue("background", url)}
              className={cn(
                "border-2 shadow-sm rounded-md",
                details.background === url
                  ? "border-basePrimary"
                  : "border-gray-200"
              )}
            >
              <img src={url} />
            </button>
          ))}
      </div>
    </>
  );
};

export default Background;
