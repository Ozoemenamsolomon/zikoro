"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";


interface OrganizationNavbarProps {
  logoUrl?: string;
}

const OrganizationNavbar: React.FC<OrganizationNavbarProps> = ({ logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="fixed w-full transition-all duration-300 top-0 z-50">
      <nav className="p-4 bg-white text-base">
        <div className="flex mx-auto lg:max-w-6xl justify-between items-center pb-2">
          { isValidUrl(logoUrl) && (
            <Image
              className="cursor-pointer w-[128px] h-[35px]"
              onClick={() => router.push("/")}
              src={logoUrl as string}
              alt="logo"
              width={128}
              height={35}
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default OrganizationNavbar;
