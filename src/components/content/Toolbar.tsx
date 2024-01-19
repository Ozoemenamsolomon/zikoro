"use client";

import { type Editor } from "@tiptap/react";
import { Bold, Italic } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { ListBullet } from "styled-icons/heroicons-outline";

type Props = {
  editor: Editor | null;
};

export const Toolbar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </Toggle>
      {/* <Toggle
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strike className="h-4 w-4" />
            </Toggle> */}
      {/* <Toggle
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleMark({ type: 'underline': "" }).run()}
            >
                <Underline className="h-4 w-4" />
            </Toggle> */}

      {/* <Toggle>
                <Code className="h-4 w-4" />
            </Toggle> */}
      <Toggle
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBullet className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
