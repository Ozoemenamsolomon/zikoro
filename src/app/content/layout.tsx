"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye } from "styled-icons/evil";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";
import { Button } from "@/components/content/Button";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Home({ children }: { children?: React.ReactNode }) {
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
    <div className="w-[100%] h-[100%] bg-white">
      <main>
        <div className="p-4 text-base flex items-center justify-between text-[#3E404B] border-y border-basebody">
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
                    <Check size={16} className="text-bluebg" />
                  </button>
                </div>
                <Button
                  containerClassName="border border-bluebg text-bluebg"
                  type="submit"
                  text="Publish"
                  spanClassName="mr-2"
                  children={<UploadOutline width={20} />}
                  onClick={() => {
                    toast.success("Event successfully published!");
                  }}
                />

                <Button
                  text="Preview"
                  spanClassName="mr-2"
                  type="button"
                  containerClassName="bg-bluebg text-white border"
                  children={<Eye color="white" width={20} />}
                />
              </div>
            </div>
          )}
        </div>
        <div className="px-4 my-6">{children}</div>
        <Toaster />
      </main>
    </div>
  );
}
