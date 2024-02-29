"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye } from "styled-icons/evil";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";
import { Button } from "@/components";
import { useState } from "react";
import { toast } from "react-hot-toast";
export function ContentTopNav() {
    const links = [
        {
          name: "Event",
          href: "/content",
        },
        {
          name: "Contact",
          href: "/content/contact",
        },
        {
          name: "Discount",
          href: "/content/discount",
        },
        {
          name: "Badge",
          href: "/content/badge",
        },
        {
          name: "Certificate",
          href: "/content/certificate",
        },
      ];
      const pathname = usePathname();
      const [isSaved, setIsSaved] = useState<boolean>(true);
    return (
        <div className="w-full p-4 text-base flex items-center justify-between text-[#3E404B] border-y border-basebody">
        <div className="flex items-center font-normal justify-center space-x-8 text-[14px]">
          {links.map(({ name, href }, index) => {
            return (
              <Link
                href={href}
                key={index}
                className={`pl-2 ${pathname === href && "text-bluebg"}`}
              >
                {name}
              </Link>
            );
          })}
        </div>
        {pathname !== "/content/contact" && pathname !== "/content" ? null : (
          <div className="flex items-center justify-center space-x-6 mx-4">
            <div className="space-x-3 flex items-center justify-center text-[14px]">
              <div className="flex justify-center items-center pr-4 text-[#717171]">
                <button
                  className="text-center text-[14px]"
                  onClick={() => {
                    setIsSaved(!isSaved);
                    if (isSaved) {
                      toast.success("Saved");
                    } else {
                      toast.error("Event has already been saved");
                    }
                  }}
                  type="submit"
                  form="form"
                >
                  <span className="pr-[2px] ">
                    {isSaved ? "Save" : "Saved"}
                  </span>
                  <Check size={16} className="text-zikoro" />
                </button>
              </div>
              <Button
                onClick={() => toast.success("Event successfully published!")}
                type="submit"
                className="border border-zikoro gap-x-2 text-zikoro"
              >
                <UploadOutline width={20} />
                <p>Published</p>
              </Button>
              <Button
                onClick={() => toast.success("Event successfully published!")}
                type="submit"
                className="text-gray-50 gap-x-2 bg-zikoro"
              >
                <Eye color="white" width={20} />
                <p>Preview</p>
              </Button>
            </div>
          </div>
        )}
      </div>
    )
}