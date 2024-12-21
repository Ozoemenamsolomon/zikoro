import React from "react";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export const Editor = ({
  onChangeContent,
}: {
  onChangeContent: (content: string) => void;
}) => {
  const [state, setState] = React.useState({ value: "" });
  const handleChange = (value: string) => {
    setState({ value });
    onChangeContent(value);
  };

  return (
    <div className="text-editor">
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={state.value}
        onChange={handleChange}
        placeholder={"Enter message"}
        modules={modules}
        formats={formats}
        className="w-full bg-white ql-container focus:ring-1 ring-black"
      />
    </div>
  );
};

export default Editor;
