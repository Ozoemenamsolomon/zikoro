import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import {
  FaCircle,
  FaRulerHorizontal,
  FaRulerVertical,
  FaSquare,
  FaSquareFull,
} from "react-icons/fa";

import { ActiveTool, Editor } from "@/components/editor/types";
import { ShapeTool } from "@/components/editor/components/shape-tool";
import { ToolSidebarClose } from "@/components/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/components/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "shapes" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your credential"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool
            onClick={() => editor?.addHorizontalLine()}
            icon={() => (
              <div>
                <div className="h-2 w-full bg-black" />
              </div>
            )}
          />
          <ShapeTool
            onClick={() => editor?.addVerticalLine()}
            icon={() => (
              <div className="h-full flex justify-center">
              <div className="h-full w-2 bg-black" />
              </div>
            )}
          />
          <ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
          <ShapeTool
            onClick={() => editor?.addSoftRectangle()}
            icon={FaSquare}
          />
          <ShapeTool
            onClick={() => editor?.addRectangle()}
            icon={FaSquareFull}
          />
          <ShapeTool onClick={() => editor?.addTriangle()} icon={IoTriangle} />
          <ShapeTool
            onClick={() => editor?.addInverseTriangle()}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool onClick={() => editor?.addDiamond()} icon={FaDiamond} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
