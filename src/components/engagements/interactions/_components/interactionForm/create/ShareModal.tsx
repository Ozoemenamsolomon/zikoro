"use client";

import { SlSocialFacebook } from "react-icons/sl";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { RxLink2 } from "react-icons/rx";
import Link from "next/link";
import copy from "copy-to-clipboard";
import { MdClose } from "react-icons/md";
import { SlSocialLinkedin } from "react-icons/sl";
import { useState } from "react";
import { Button } from "@/components/custom_ui/Button";
import { IoCodeSlashOutline } from "react-icons/io5";

export function ShareModal({ link , close}: {close:() => void; link: string }) {
  const [isShow, showSuccess] = useState(false);

  function copyLink() {
    copy(link);
    showSuccess(true);
    setTimeout(() => showSuccess(false), 2000);
  }

  const socials = [
    {
      name:"Whatsapp",
      Icon: FaWhatsapp,
      link: `https://api.whatsapp.com/send?text=${link} `,
    },
    {
      name:"Email",
      Icon: HiOutlineMail,
      link: `mailto:?subject=Fill%20this%20engagement%20form&body=${link}`,
    },
    {
      name:"X",
      Icon: FaXTwitter,
      link: `https://x.com/intent/tweet?url=${link}`,
    },
    {
      name:"Facebook",
      Icon: SlSocialFacebook,
      link: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
    },
    {
      name:"LinkedIn",
      Icon: SlSocialLinkedin,
      link: `https://www.linkedin.com/shareArticle?url=${link}`,
    },
  ];
  return (
    <div className="w-full full inset-0 fixed bg-black/40 z-[100]">
      <div className="w-[95%] max-w-4xl rounded-lg bg-white shadow absolute inset-0 h-fit max-h-[85%] flex flex-col overflow-y-auto no-scrollbar box-animation m-auto p-4 sm:p-6">
        <Button
          onClick={close}
          className="px-0 self-end w-11 h-11 rounded-full from-custom-bg-gradient-start  to-custom-bg-gradient-end bg-gradient-to-tr"
        >
          <MdClose size={22} />
        </Button>
        <div className="flex flex-col items-center justify-center gap-y-5 sm:gap-y-8">
          <h2 className="text-base sm:text-xl">Share your form</h2>

          <div className="w-full  gap-4 flex flex-wrap items-center justify-center">
            <button
              onClick={copyLink}
              className="w-24 rounded-lg relative p-3 from-custom-bg-gradient-start  to-custom-bg-gradient-end bg-gradient-to-tr flex flex-col gap-y-3 items-center justify-center h-24"
            >
              <RxLink2 size={50} />
              <p>Link</p>
              {isShow && (
                <p className="absolute text-xs w-[100px] -top-10 bg-black/50 text-white font-medium rounded-md px-3 py-2 transition-transform tranition-all duration-300 animate-fade-in-out">
                  Link Copied
                </p>
              )}
            </button>
            {socials.map(({ Icon, link, name }, index) => (
              <Link
                key={index}
                href={link}
                target="_blank"
                className="w-24 from-custom-bg-gradient-start rounded-lg p-3  to-custom-bg-gradient-end bg-gradient-to-tr flex-col gap-y-3 flex items-center justify-center h-24"
              >
                <Icon size={50} />
                <p>{name}</p>
              </Link>
            ))}
            <button
            //  onClick={copyLink}
              className="w-24 rounded-lg relative p-3 from-custom-bg-gradient-start  to-custom-bg-gradient-end bg-gradient-to-tr flex flex-col gap-y-3 items-center justify-center h-24"
            >
              <IoCodeSlashOutline size={50} />
              <p>Embed</p>
             
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
