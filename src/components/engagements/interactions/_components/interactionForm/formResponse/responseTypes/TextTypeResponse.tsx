import { TFormattedEngagementFormAnswer } from "@/types/engagements";

export function TextTypeResponse({
  response,
}: {
  response: TFormattedEngagementFormAnswer;
}) {
  return (
    <div className="w-full">
      <p className="border items-start p-2 w-full rounded-lg">{response?.response ?? ""}</p>
    </div>
  );
}
