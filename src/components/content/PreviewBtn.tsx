"use client";
import * as React from "react";
import { Eye } from "styled-icons/evil";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";

export const PreviewBtn = () => {
  return (
    <>
      <button
        className="w-[120px] flex justify-center items-center bg-bluebg text-white py-[10px] px-[16px] rounded-[5px]"
        type="submit"
        form="form"
      >
        <span className="mr-2">Preview</span>
        <Eye size={25} />
      </button>
    </>
  );
};
