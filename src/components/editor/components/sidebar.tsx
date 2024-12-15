"use client";

import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
  Lock,
  QrCode,
} from "lucide-react";

import { ActiveTool } from "@/components/editor/types";
import { SidebarItem } from "@/components/editor/components/sidebar-item";
import { PiSelectionBackground } from "react-icons/pi";
import { Signature } from "styled-icons/fluentui-system-filled";


interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="flex h-full w-[100px] flex-col overflow-y-auto border-r bg-white">
      <ul className="flex flex-col">
        <SidebarItem
          icon={LayoutTemplate}
          label="Design"
          isActive={activeTool === "templates"}
          onClick={() => onChangeActiveTool("templates")}
        />
        <SidebarItem
          icon={PiSelectionBackground}
          label="Background"
          isActive={activeTool === "background"}
          onClick={() => onChangeActiveTool("background")}
        />
        <SidebarItem
          icon={ImageIcon}
          label="Image"
          isActive={activeTool === "images"}
          onClick={() => onChangeActiveTool("images")}
        />
        <SidebarItem
          icon={Type}
          label="Text"
          isActive={activeTool === "text"}
          onClick={() => onChangeActiveTool("text")}
        />
        <SidebarItem
          icon={QrCode}
          label="QR Code"
          isActive={activeTool === "qrCode"}
          onClick={() => onChangeActiveTool("qrCode")}
        />
        <SidebarItem
          icon={Lock}
          label="Attributes"
          isActive={activeTool === "verification"}
          onClick={() => onChangeActiveTool("verification")}
        />
        <SidebarItem
          icon={Shapes}
          label="Shapes"
          isActive={activeTool === "shapes"}
          onClick={() => onChangeActiveTool("shapes")}
        />
        <SidebarItem
          icon={Signature}
          label="Signature"
          isActive={activeTool === "draw"}
          onClick={() => onChangeActiveTool("draw")}
        />
        {/* <SidebarItem
          icon={Sparkles}
          label="AI"
          isActive={activeTool === "ai"}
          onClick={() => onChangeActiveTool("ai")}
        /> */}
        <SidebarItem
          icon={Settings}
          label="Settings"
          isActive={activeTool === "settings"}
          onClick={() => onChangeActiveTool("settings")}
        />
      </ul>
    </aside>
  );
};
