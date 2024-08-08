"use client";

import { FeedBackComp } from "@/components/modals/EventFeedback";
import { useState } from "react";
import { ThumbUp } from "styled-icons/material-rounded";
export default function AdminFeedBack() {
  const [showSuccess, setShowSuccess] = useState(false);

  function onClose() {
    setShowSuccess((prev) => !prev);
  }
  return (
    <div className="w-full max-w-xl m-auto min-h-screen flex flex-col items-start justify-center gap-y-4 bg-white py-8 sm:py-10 px-4 sm:px-6">
      {!showSuccess ? (
        <FeedBackComp close={onClose} />
      ) : (
        <div className="w-full bg-white rounded-lg h-[40vh] shadow flex flex-col items-center justify-center gap-y-3">
          <ThumbUp size={36} className="text-basePrimary" />
          <div className="text-center text-lg sm:text-3xl font-semibold">
            Thank you for your feedback!
          </div>
        </div>
      )}
    </div>
  );
}
