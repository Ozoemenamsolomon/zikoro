import { FeedBackComp } from "@/components/modals/EventFeedback";

export default function AdminFeedBack() {
  return (
    <div className="w-full max-w-2xl m-auto min-h-screen flex flex-col items-start justify-center gap-y-4 bg-white py-8 sm:py-10 px-4 sm:px-6">
      <FeedBackComp />
    </div>
  );
}
