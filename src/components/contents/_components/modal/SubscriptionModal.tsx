"use client";

import { Button } from "@/components";
export function SubscriptionModal({
  close,
  content,
  isEnterprise,
}: {
  content: string;
  close: () => void;
  isEnterprise?: boolean;
}) {
  return (
    <div
      onClick={close}
      className="w-full bg-black/40 fixed inset-0 h-full z-[100]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] max-w-xl m-auto flex flex-col items-center py-6 px-4 justify-center gap-y-12 absolute inset-0 bg-white rounded-lg h-fit  p-3"
      >
        {content}

        {!isEnterprise && (
          <Button
            onClick={() => window.open(`/pricing`)}
            className="font-medium text-white bg-basePrimary rounded-lg h-12"
          >
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
}
