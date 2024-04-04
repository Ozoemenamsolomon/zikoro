"use client"

import Image from "next/image";
import Link from "next/link";

export function ActionCard({
  image,
  href,
  title,
  subTitle,
}: {
  image: string;
  href: string;
  title: string;
  subTitle: string;
}) {
  return (
    <Link
      href={href}
      className="w-52 h-48 rounded-md shadow p-4 bg-white flex flex-col items-center justify-center gap-y-3"
    >
      <Image
        className="w-12 h-12"
        src={image}
        width={100}
        height={100}
        alt={title}
      />
      <h2 className="font-semibold text-center text-sm sm:text-base">{title}</h2>
      <p className="text-center text-mobile sm:text-sm">{subTitle}</p>
    </Link>
  );
}
