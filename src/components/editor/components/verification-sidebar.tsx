import { ActiveTool, Editor } from "@/components/editor/types";
import { ToolSidebarClose } from "@/components/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/components/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface VerificationSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const VerificationSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: VerificationSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "verification" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Attributes"
        description="Add attributes to your credential"
      />
      <ScrollArea>
        <div className="space-y-4 border-b p-4">
          <Button
            className="w-full"
            onClick={() => editor?.addText("Certificate ID: #{certificateId#}")}
          >
            Add Certificate Id
          </Button>
          <Button
            className="w-full"
            onClick={() => editor?.addText("#{first_name#}")}
          >
            Add a Attendee First name
          </Button>
          <Button
            className="w-full"
            onClick={() => editor?.addText("#{last_name#}")}
          >
            Add a Attendee Last name
          </Button>
          <Button
            className="w-full"
            onClick={() => editor?.addText("#{first_name#} #{last_name#}")}
          >
            Add a Attendee full name
          </Button>
          <Button
            className="w-full"
            onClick={() =>
              editor?.addText(
                "https://www.zikoro.com/credentials/certificate/verify/#{certificateId#}"
              )
            }
          >
            Add a Verification URL
          </Button>
          {/* <Button
            className="w-full"
            onClick={() =>
              editor?.addQRCode(
                "www.zikoro.com/credentials/certificate/verify/#{certificateId#}"
              )
            }
          >
            Add a QR Code
          </Button> */}
          <Button
            className="w-full"
            onClick={() => editor?.addText("#{city#} #{country#}")}
          >
            Add a location
          </Button>
          <Button
            className="w-full"
            onClick={() => editor?.addImage("#{placeholder_profile}#")}
          >
            Add a Profile Image
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
