"use client"

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
// import { Quill } from "react-quill";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });


export default function InteractionInput({
  onChange,
  defaultValue,
  placeholder,
  error
}: {
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  error?:string;
}) {


  const quillModules = {
    toolbar:  {
      container: [
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        //   [{ direction: "rtl" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
    
        [
          {
            font: [],
          },
        ],
     

        // ["imageResize", "imageTextAlternative"],
      ],
    } ,
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };



  const quillFormats = [
    "header",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "clean",
    "font",
    "size",
    "indent",
    "list",
    "script"
  ];

  const [content, setContent] = useState(defaultValue);
  const handleEditorChange = (content: string) => {
    setContent(content);
    onChange(content);
    
  };

  
  return (
  <div className="w-full interaction-input">
      <QuillEditor
      value={content}
    
      onChange={(e) => {
        handleEditorChange(e);
      }}
      modules={ quillModules}
      
      formats={ quillFormats}
      theme="snow"
      placeholder={placeholder || "Enter description"}
      className="w-full bg-white ql-container focus:ring-1 ring-black h-[200px]"
    />
    {error && <p className="text-xs textred-500 mt-2">{error}</p>}
  </div>
  );
}
