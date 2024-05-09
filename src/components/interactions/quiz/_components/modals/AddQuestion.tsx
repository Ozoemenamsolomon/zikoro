"use client"

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  Textarea,
} from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";

export function AddQuestion({close}:{close:() => void}) {
  return (
    <div
        onClick={close}
        role="button"
        className="w-full h-full fixed inset-0 z-[300] bg-black/50"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=
            "py-6 px-4 w-[95%] max-w-2xl m-auto rounded-lg bg-white absolute inset-0 overflow-y-auto max-h-[85%] h-fit"
        >
 <div className="flex mb-4 items-center justify-between w-full">
            <h2 className="font-semibold text-lg sm:text-2xl">Create Question</h2>
            <Button onClick={close}>
              <CloseOutline size={22} />
            </Button>
          </div>


</div>
    </div>
  )
}