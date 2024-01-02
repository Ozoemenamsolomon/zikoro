"use client";
import * as React from "react";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";

export const PublishBtn = () => {
  return (
    <>
      <button
        className="flex justify-center items-center text-purplebg border-[1px] border-purplebg py-[10px] px-[16px] rounded-[5px]"
        type="submit"
        form="form"
      >
        <span className="mr-2">Pulish</span>
        <UploadOutline size={20} />
      </button>
    </>
  );
};
