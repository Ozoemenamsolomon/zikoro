"use client";

import { type Editor } from "@tiptap/react";
import { TypeBold } from "@styled-icons/bootstrap/TypeBold";
import { TypeItalic } from "@styled-icons/bootstrap/TypeItalic";
import { Toggle } from "@/components/ui/toggle";
import { ListBullet } from "styled-icons/heroicons-outline";
import { StrikethroughS } from "styled-icons/material";
import { CodeDownload } from "styled-icons/ionicons-outline";

type Props = {
  editor: Editor | null;
};

export const Toolbar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1 justify-evenly flex-shrink border border-basebody rounded-md mb-2 p-2">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <TypeBold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <TypeItalic className="h-4 w-4" />
      </Toggle>

      <Toggle onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        rule
      </Toggle>
      <Toggle onClick={() => editor.chain().focus().setHardBreak().run()}>
        break
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </Toggle>
      <Toggle
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughS className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeDownload className="h-4 w-4" />
      </Toggle>
      {/* <Toggle
        pressed={editor.isActive("list")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBullet className="h-4 w-4" />
      </Toggle> */}
    </div>
  );
};
