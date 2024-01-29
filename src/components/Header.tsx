"use client";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const links = [
    {
      name: "Features",
      href: "/",
    },
    {
      name: "Use cases",
      href: "/",
    },
    {
      name: "Resources",
      href: "/",
    },
    {
      name: "Pricing",
      href: "/",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];
  return (
    <div className="h-24 px-10 py-5 grid grid-cols-4 justify-between items-center bg-white">
      <div className="">
        <Link href="/">
          <Image
            src="/zikoro2a.svg"
            alt="zikoro logo"
            width={140}
            height={100}
          />
        </Link>
      </div>
      <div className="col-span-2 flex justify-evenly text-[#3E404B] text-base ">
        {links.map(({ name, href }) => (
          <Link key={name} href={href}>
            {name}
          </Link>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <button className="h-[55px] w-[140px] border-2 border-[#001FCC] text-[#001FCC] rounded-md">
          Login
        </button>
        <button className="h-[55px] w-[150px] bg-[#001FCC] text-white rounded-md">
          Start for free
        </button>
      </div>
    </div>
  );
};
