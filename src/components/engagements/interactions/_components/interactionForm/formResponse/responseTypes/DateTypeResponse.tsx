import { TFormattedEngagementFormAnswer } from "@/types/engagements";

export function DateTypeResponse({
  response,
}: {
  response: TFormattedEngagementFormAnswer;
}) {
  return (
    <div className="w-full">
      <p className="p-2 text-center">{response?.response ?? ""}</p>
    </div>
  );
}
