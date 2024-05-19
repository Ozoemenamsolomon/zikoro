"use client"

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
// import { Quill } from "react-quill";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });


export default function TextEditor({
  onChange,
  defaultValue,
  placeholder,
  isBlog,
}: {
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  isBlog ?:boolean
}) {
  const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
      <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
      <path
        className="ql-stroke"
        d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
      />
    </svg>
  );

  // Redo button icon component for Quill editor
  const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
      <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
      <path
        className="ql-stroke"
        d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
      />
    </svg>
  );

  const quillModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        //   [{ direction: "rtl" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [
          {
            font: [],
          },
        ],
        //  [{ align: [] }],
        ["link"], //  "video"
        ["clean"],
        ["undo", "redo"],

        // ["imageResize", "imageTextAlternative"],
      ],
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  const quillBlogModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        //   [{ direction: "rtl" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [
          {
            font: [],
          },
        ],
        //  [{ align: [] }],
        ["link", "image",], //  "video"
        ["clean"],
        ["undo", "redo"],

        // ["imageResize", "imageTextAlternative"],
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
    // "align",
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

  const [content, setContent] = useState(defaultValue);
  const handleEditorChange = (content: string) => {
    setContent(content);
    onChange(content);
    
  };

  return (
    <QuillEditor
      value={content}
      onChange={(e) => {
        handleEditorChange(e);
      }}
      modules={isBlog? quillBlogModules : quillModules }
      formats={quillFormats}
      theme="snow"
      placeholder={placeholder || "Enter description"}
      className="w-full bg-white ql-container focus:ring-1 ring-black h-[200px]"
    />
  );
}
