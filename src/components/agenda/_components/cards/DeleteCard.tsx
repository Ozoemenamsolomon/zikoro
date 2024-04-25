"use client"

import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { Button, Portal } from "@/components";
import {useEffect, useState} from "react"
export function DeleteCard({
    close,
    deletes,
    loading,
  }: {
    loading: boolean;
    deletes: () => Promise<void>;
    close: () => void;
  }) {
    const [deleting, setDeleting] = useState(false)
 
    useEffect(() => {
setDeleting(true)
    },[loading])
    return (
      <Portal>
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
            <p>Are you sure you want to continue?</p>
  
            <div className="w-full flex items-end justify-end gap-x-3">
              <Button onClick={close}>Cancel</Button>
  
              <Button
                onClick={deletes}
                className="text-gray-50 bg-red-500 w-[120px] gap-x-2"
              >
                {loading && <LoaderAlt className="animate-spin" size={22} />}
                <p> Delete</p>
              </Button>
            </div>
          </div>
        </div>
      </Portal>
    );
  }
  