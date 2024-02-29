import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export default function TextEditor() {
  const quillModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [
          {
            font: [],
          },
        ],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
        ["undo"],
        ["redo"],
        ["imageResize", "imageTextAlternative"],
      ],
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
    "undo",
    "redo",
    "imageResize",
    "clean",
    "code-block",
    "imageTextAlternative",
    "font",
    "size",
    "background",
    "indent",
    "list",
  ];

  const [content, setContent] = useState("");
  const handleEditorChange = (content: string) => {
    setContent(content);
    console.log("newContent", content);
  };

  return (
    <div className="mb-5">
      <QuillEditor
        value={content}
        onChange={(e) => {
          handleEditorChange(e);
        }}
        modules={quillModules}
        formats={quillFormats}
        theme="snow"
        placeholder="Enter description"
        className="w-full bg-white ql-container focus:ring-1 ring-black "
      />
    </div>
  );
}
