"use client"

import {useState} from "react"
import copy from "copy-to-clipboard";
import { Copy } from "@styled-icons/feather/Copy";
import { TriangleDown } from "@styled-icons/entypo/TriangleDown";
export function CopyLink({ link }: { link: string }) {
    const [isCopy, setCopy] = useState(false);
  
    function copied() {
      copy(link);
      setCopy(true);
  
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    }
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          copied();
        }}
        className="relative"
      >
        <Copy size={16} />
        {isCopy && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute shadow-lg rounded-lg border top-[-2rem] flex items-center justify-center w-fit px-4 py-2 px- -right-3 bg-basePrimary"
          >
            <p className="text-gray-50 text-sm">Copied</p>
  
            <div className="absolute right-[38%] bottom-[-13px]">
              <TriangleDown size={18} className=" text-basePrimary" />
            </div>
          </div>
        )}
      </button>
    );
  }