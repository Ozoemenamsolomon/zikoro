"use client";
import React from "react";
import { Facebook, X, Linkedin, Instagram } from "@/constants/icons";

export default function CopyrightFooter() {
  return (
    <div className="mt-10 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end">
      <div className="mt-4 lg:mt-6 px-5 lg:px-0 flex  justify-between items-center max-w-6xl mx-auto ">
        <div className=" py-4 lg:py-14 flex justify-between">
          <p className="text-[13px] lg:text-base font-normal">
            {" "}
            <span className="hidden lg:inline">Copyright</span> © 2024 - Zikoro{" "}
            <span className="hidden lg:inline"> - an OrthoEx brand</span>{" "}
          </p>
        </div>
        <ul className="flex gap-x-3 lg:gap-x-4">
          <li>
            <a href="https://m.facebook.com/profile.php?id=61558280512718&name=xhp_nt__fb__action__open_user">
              <Facebook />
            </a>
          </li>
          <li>
            <a href="">
              <X />
            </a>
          </li>

          <li>
            <a href="https://www.linkedin.com/company/zikoro">
              <Linkedin />
            </a>
          </li>

          <li>
            <a href="">
              <Instagram />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
