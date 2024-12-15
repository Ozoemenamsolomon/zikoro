import { useEffect, useMemo, useState } from "react";

import { ActiveTool, Editor } from "@/components/editor/types";
import { ToolSidebarClose } from "@/components/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/components/editor/components/tool-sidebar-header";
import { ColorPicker } from "@/components/editor/components/color-picker";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@/types";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import COLORTAG from "@/utils/colorTag";
import { ArrowUpDownIcon } from "lucide-react";

interface SettingsSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  event: Event;
  onChangeSettings: (settings: any) => void;
  settings: any;
  saveSettings: () => void;
  isSaving: boolean;
}

export const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
  event,
  onChangeSettings,
  settings,
  saveSettings,
  isSaving,
}: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(
    () => workspace?.fill ?? "#ffffff",
    [workspace]
  );

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);
  const [skills, setSkills] = useState<{ value: string; color: string }[]>(
    settings.skills
  );

  const [newSkill, setNewSkill] = useState<string>("");
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, [initialWidth, initialHeight, initialBackground]);

  const changeWidth = (value: string) => setWidth(value);
  const changeHeight = (value: string) => setHeight(value);
  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Settings"
        description="Change the look of your workspace"
      />
      <ScrollArea>
        <form className="space-y-4 p-4" onSubmit={onSubmit}>
          <div className="pt-4 pb-2">
            <div className="relative border">
              <Label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                Issue date
              </Label>
              <Input
                placeholder="Enter event title"
                type="datetime-local"
                defaultValue={event?.endDateTime}
                value={settings.publishOn}
                className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                onInput={(e) =>
                  onChangeSettings({ publishOn: e.currentTarget.value })
                }
              />
            </div>
          </div>
          <div className="relative border">
            <Label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
              Height
            </Label>
            <Input
              placeholder="Height"
              value={height}
              type="number"
              onChange={(e) => changeHeight(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              const oldHeight = height;
              changeHeight(width);
              changeWidth(oldHeight);
            }}
            className="flex justify-center items-center text-gray-400 mx-auto w-fit"
          >
            <ArrowUpDownIcon className="w-6 h-6" />
          </button>
          <div className="relative border flex">
            <Label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
              Width
            </Label>
            <Input
              placeholder="Width"
              value={width}
              type="number"
              className="flex-1"
              onChange={(e) => changeWidth(e.target.value)}
            />
          </div>
          <div className="space-y-4 pt-4  pb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="border-basePrimary border-2 text-basePrimary bg-transparent flex gap-2 hover:bg-basePrimary/20">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 1024 1024"
                    height="1.5em"
                    width="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                  </svg>
                  <span>Earned Skills</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="px-3">
                <DialogHeader>
                  <DialogTitle>
                    <span className="capitalize">Add Skills</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative py-4">
                    <span className="text-tiny text-gray-500 font-medium absolute top-2 left-2">
                      skill
                    </span>
                    <Input
                      type="text"
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 focus-visible:ring-0"
                      value={newSkill}
                      onInput={(e) => setNewSkill(e.currentTarget.value)}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {COLORTAG.map((colorValue) => (
                      <button
                        className={`
              h-8 w-8 rounded-full
              ${color === colorValue ? "opacity-100" : "opacity-25"}
              `}
                        style={{ backgroundColor: colorValue }}
                        key={colorValue}
                        onClick={() => setColor(colorValue)}
                      />
                    ))}
                  </div>
                </div>
                <DialogClose asChild>
                  <Button
                    disabled={
                      !newSkill ||
                      !color ||
                      skills.some(({ value }) => newSkill === value)
                    }
                    onClick={() => {
                      const newSkills = [...skills, { value: newSkill, color }];
                      setSkills(newSkills);
                      setNewSkill("");
                      setColor("");
                      onChangeSettings({ skills: newSkills });
                    }}
                    className="bg-basePrimary"
                  >
                    Add Skill
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <div className="flex flex-wrap justify-start gap-2">
              {skills.map(({ value, color }) => (
                <div
                  className="relative text-sm flex items-center gap-1.5 p-2 rounded w-fit"
                  style={{
                    backgroundColor: color + "22",
                    color: color,
                    borderWidth: "2px",
                    borderColor:
                      skills && skills.includes({ value, color })
                        ? color
                        : color + "22",
                  }}
                >
                  <button
                    onClick={() => {
                      const newSkills = skills.filter(
                        (skill) => skill.value !== value
                      );
                      setSkills(newSkills);
                    }}
                    style={{
                      backgroundColor: color + "55",
                      color: color,
                    }}
                    className="bg-white h-4 w-4 flex items-center justify-center text-[8px] absolute -right-2 -top-2 rounded-full"
                  >
                    x
                  </button>
                  <span className="font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={saveSettings}
            type="submit"
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </form>
        <div className="p-4">
          <ColorPicker
            value={background as string}
            onChange={changeBackground}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
