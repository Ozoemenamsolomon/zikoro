import { TFormattedEngagementFormAnswer } from "@/types/engagements";
import { InlineIcon } from "@iconify/react";
import { saveAs } from "file-saver";

export function UploadTypeResponse({
  response,
}: {
  response: TFormattedEngagementFormAnswer;
}) {
  const data = response?.response as {
    name: string;
    id: string;
    fileData: string;
  };
  return (
    <div className="w-full flex items-end mx-auto justify-between max-w-lg rounded-lg p-2">
      <div className="flex w-[80%]  items-center gap-x-2">
        <InlineIcon icon="solar:file-bold-duotone" fontSize={24} />
        <p>{data?.name ?? ""}</p>
      </div>

      <button
        onClick={() => {
          saveAs(data?.fileData, "download");
        }}
        className="flex items-center gap-x-1"
      >
        <p>Download</p>
        <InlineIcon icon="et:download" fontSize={18} />
      </button>
    </div>
  );
}
