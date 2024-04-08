"use client";
import React from "react";
import Image from "next/image";
import { LogOut } from "styled-icons/ionicons-outline";
import { PersonFeedback } from "styled-icons/fluentui-system-filled";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export const UserActions = () => {
  // const { user, error, isLoading } = useUser();
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>an error has occurred</div>;
  // if (!user) return <Link href="/api/auth/login">Login</Link>;

  // console.log({ user });

  // const {
  //   user: { name: userName, avatar },
  // } = {
  //   user: {
  //     name: user.nickname,
  //     avatar: "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp",
  //   },
  // };

  return (
    <div className="flex flex-col gap-4 border-t p-4 border-basebody">
      <Link href={"/profile"}>
        <div className="flex items-center gap-2">
          <Image
            src={"/images/profile%201.png"}
            alt={"user avatar"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <p className="text-black">Bilal</p>
        </div>
      </Link>
      <button className="flex gap-2 text-black">
        <PersonFeedback className="w-6 h-6" />
        Give feedback
      </button>
      <Link href={"/referrals"}>
        <div className="flex items-center gap-2 text-basePrimary">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 16 16"
            height="1.5em"
            width="1.5em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M2 6v8.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V6h1v8.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 14.5V6h1zm8-5a1.5 1.5 0 00-1.5 1.5c0 .098.033.16.12.227.103.081.272.15.49.2A3.44 3.44 0 009.96 3h.015L10 2.999l.025.002h.014A2.569 2.569 0 0010.293 3c.17-.006.387-.026.598-.073.217-.048.386-.118.49-.199.086-.066.119-.13.119-.227A1.5 1.5 0 0010 1zm0 3h-.006a3.535 3.535 0 01-.326 0 4.435 4.435 0 01-.777-.097c-.283-.063-.614-.175-.885-.385A1.255 1.255 0 017.5 2.5a2.5 2.5 0 015 0c0 .454-.217.793-.506 1.017-.27.21-.602.322-.885.385a4.434 4.434 0 01-1.104.099H10z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6 1a1.5 1.5 0 00-1.5 1.5c0 .098.033.16.12.227.103.081.272.15.49.2A3.44 3.44 0 005.96 3h.015L6 2.999l.025.002h.014l.053.001a3.869 3.869 0 00.799-.076c.217-.048.386-.118.49-.199.086-.066.119-.13.119-.227A1.5 1.5 0 006 1zm0 3h-.006a3.535 3.535 0 01-.326 0 4.435 4.435 0 01-.777-.097c-.283-.063-.614-.175-.885-.385A1.255 1.255 0 013.5 2.5a2.5 2.5 0 015 0c0 .454-.217.793-.506 1.017-.27.21-.602.322-.885.385a4.435 4.435 0 01-1.103.099H6zm1.5 12V6h1v10h-1z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M15 4H1v1h14V4zM1 3a1 1 0 00-1 1v1a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H1z"
              clipRule="evenodd"
            />
          </svg>
          <p>Refer a friend</p>
        </div>
      </Link>
      <Link href="/api/auth/logout" className="flex gap-2 text-red-700">
        <LogOut className="w-6 h-6" />
        Log out
      </Link>
    </div>
  );
};
