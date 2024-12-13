"use client";

import { InlineIcon } from "@iconify/react";

export default function Page() {
  return (
    <div className="w-full bg-white fixed inset-0 h-full">
      <div className="w-fit flex items-center justify-center flex-col gap-8 absolute m-auto inset-0">
        <InlineIcon icon="line-md:alert-circle-twotone" fontSize={24} />
        <p className="font-semibold">
          This event is not accessible to attendees
        </p>
      </div>
    </div>
  );
}
