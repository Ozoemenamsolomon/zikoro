"use client";

import { Button } from "@/components";
export function SubscriptionModal() {
  
  function close() {
    
    if (typeof window !== "undefined") {
      const subModal = document.getElementById("subscription-modal");
      if (subModal) {
        subModal.style.display = "none";
      }
    }
  }

  return (
    <div
      id="subscription-modal"
      onClick={close}
      className="w-full hidden  bg-black/40 fixed inset-0 h-full z-[999999999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] max-w-xl box-animation m-auto flex flex-col items-center py-10 px-4 justify-center gap-y-12 absolute inset-0 bg-white rounded-lg h-fit  p-3"
      >
        <p className="text-center leading-8" id="content"></p>

        <Button
          id="upgrade-button"
          onClick={() => window.open(`/pricing`)}
          className="font-medium text-white bg-basePrimary rounded-lg h-12"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
}
