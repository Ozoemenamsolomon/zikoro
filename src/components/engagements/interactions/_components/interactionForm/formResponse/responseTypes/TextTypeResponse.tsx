import { TFormattedEngagementFormAnswer } from "@/types/engagements";

export function TextTypeResponse({
  response,
}: {
  response: TFormattedEngagementFormAnswer;
}) {
  return (
    <div className="w-full">
      <p className="border items-start p-3 w-full rounded-lg">{response?.response ?? ""}</p>
    </div>
  );
}
