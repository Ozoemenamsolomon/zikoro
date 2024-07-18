"use client";

import { Button } from "@/components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CloseOutline } from "styled-icons/evaicons-outline";
export function PublishCard({
  loading,
  close,
  asyncPublish,
  message,
  isPublished,
}: {
  close: () => void;
  loading: boolean;
  asyncPublish: () => Promise<void>;
  message: string;
  isPublished?: boolean;
}) {
  return (
    <div
      role="button"
      onClick={close}
      className="w-full fixed  inset-0 z-[300] h-full bg-black/50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-w-2xl h-fit flex flex-col items-start gap-y-8 justify-start rounded-lg absolute inset-0 m-auto bg-white py-6 px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-base sm:text-xl">
            {isPublished ? "Unpublish" : "Publish"}
          </h2>
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <p className="text-[13px] sm:text-sm text-gray-600">{message}</p>

        <div className="self-end flex items-center gap-x-2">
          <Button
            disabled={loading}
            onClick={close}
            className=" font-medium border text-basePrimary border-basePrimary w-fit"
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={asyncPublish}
            className="bg-basePrimary w-fit text-gray-50 gap-x-2 font-medium "
          >
            {loading && <LoaderAlt className="animate-spin" size={20} />}
            <span>{isPublished ? "Unpublish" : "Publish"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
