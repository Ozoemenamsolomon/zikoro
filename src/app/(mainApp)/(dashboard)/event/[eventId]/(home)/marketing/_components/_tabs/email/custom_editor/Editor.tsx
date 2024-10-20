import React from "react";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false, // This ensures it only loads on the client side
});

export const Editor = ({
  onChangeContent,
  recipientSource,
}: {
  onChangeContent: (content: string) => void;
  recipientSource: string;
}) => {
  const [state, setState] = React.useState({ value: "" });
  const handleChange = (value: string) => {
    setState({ value });
    onChangeContent(value);
  };

  const variables =
    recipientSource === "attendees"
      ? [
          "attendeeFirstName",
          "attendeeLastName",
          "attendeeFullName",
          "eventName",
          "eventAddress",
        ]
      : ["eventName", "eventAddress"];
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
