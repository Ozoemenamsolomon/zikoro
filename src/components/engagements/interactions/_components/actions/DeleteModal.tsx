"use client"

import {Button} from "@/components"
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { AlertTriangleOutline } from "@styled-icons/evaicons-outline/AlertTriangleOutline";

export function DeleteModal({
    close,
    asyncDelete,
    loading,
  }: {
    close: () => void;
    asyncDelete: () => Promise<any>;
    loading: boolean;
  }) {
    return (
      <div
        onClick={close}
        role="button"
        className="w-full h-full inset-0 fixed z-[300] bg-black/50"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-[95%] max-w-md rounded-xl bg-white absolute inset-0 m-auto h-fit px-4 py-6 flex flex-col items-center justify-center gap-y-14"
        >
          <div className="flex flex-col items-center justify-center gap-y-2">
            <AlertTriangleOutline size={50} className="text-basePrimary" />
            <p>Are you sure you want to delete this Question</p>
          </div>
  
          <div className="w-full flex items-end justify-end gap-x-3">
            <Button
            disabled={loading}
            onClick={close}>Cancel</Button>
  
            <Button
            disabled={loading}
              onClick={asyncDelete}
              className="text-gray-50 bg-basePrimary w-[120px] gap-x-2"
            >
              {loading && <LoaderAlt className="animate-spin" size={22} />}
              <p> Delete</p>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  