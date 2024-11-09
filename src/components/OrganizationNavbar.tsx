"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

interface OrganizationNavbarProps {
  logoUrl?: string;
  isZikoroLogo: string;
  isOrgLogo: string;
}

const OrganizationNavbar: React.FC<OrganizationNavbarProps> = ({
  logoUrl,
  isZikoroLogo,
  isOrgLogo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Check if the URL is valid
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Determine the logo source based on the props
  const logoSrc = isZikoroLogo === "true"
    ? "/zikoro.png"
    : isOrgLogo === "true" && isValidUrl(logoUrl)
    ? (logoUrl as string)
    : "/zikoro.png"; // Fallback to Zikoro logo if no valid logoUrl or conditions are met


    console.log('isZikoroLogo,',isZikoroLogo)
    console.log('logoUrl,',logoUrl)
    console.log('isOrgLogo,',isOrgLogo)
  return (
    <div className="fixed w-full transition-all duration-300 top-0 z-50">
      <nav className="p-4 bg-white text-base">
        <div className="flex mx-auto lg:max-w-6xl justify-between items-center pb-2">
          <Image
            className="cursor-pointer w-[128px] h-[35px] object-contain"
            onClick={() => router.push("/")}
            src={logoSrc}
            alt="logo"
            width={128}
            height={35}
          />
        </div>
      </nav>
    </div>
  );
};

export default OrganizationNavbar;
