import React from "react";
import Image from "next/image";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="py-2 px-4 bg-white fixed w-screen z-[100]">
        <Image
          src={"/logo.png"}
          alt={"zikoro logo"}
          width={150}
          height={100}
        ></Image>
      </header>
      <main className="bg-baseBody">{children}</main>
    </>
  );
};

export default layout;
