import { TFormattedEngagementFormAnswer } from "@/types/engagements";

export function TextTypeResponse({
  response,
}: {
  response: TFormattedEngagementFormAnswer;
}) {
  return (
    <div className="w-full mb-2">
      <p className="border items-start p-3 w-full rounded-lg flex gap-x-2">
        <span>{response?.attendeeEmail ?? ""}</span>
        <span>{response?.response ?? ""}</span>
      </p>
    </div>
  );
}
