"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./Toolbar";
// import Underline from "@tiptap/extension-underline"
// import TextAlign from "@tiptap/extension-text-align"
// import Superscript from "@tiptap/extension-superscript"
// import SubScript from "@tiptap/extension-subscript"
// import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder";
import ListItem from "@tiptap/extension-list-item";

export default function Tiptap({
  onChange,
  description,
}: {
  onChange: (content: string, editor: any) => void;
  description?: string;
  value: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Underline,
      // TextAlign.configure({ types: ["heading", "paragraph"] }),
      // Superscript,
      // SubScript,
      // Highlight,
      Placeholder.configure({
        placeholder: "Enter your description here",
        showOnlyWhenEditable: true,
        emptyNodeClass: "is-empty",
      }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor);
      // console.log(editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "h-60 p-5 w-[100%] rounded-md border border-[#f3f3f3] sm:text-sm",
      },
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
