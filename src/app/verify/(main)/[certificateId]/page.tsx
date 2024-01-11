"use client";
import React from "react";
import Image from "next/image";

const Page = ({ params }: { params: { attendeeId: string } }) => {
  const { attendeeId } = params;
  return (
    <section className="h-screen w-screen flex items-center justify-center gap-6 pt-16">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="h-[500px] bg-white flex flex-col justify-between gap-4 w-3/4">
          <div className="flex-[5%] w-full relative">
            <Image
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              src={"/images/certificate_design.png"}
              alt={"design"}
            />
          </div>
          <div className="flex-[90%] px-6">
            <div className="flex justify-between">
              <Image
                src={"/images/your_logo.png"}
                alt={"zikoro logo"}
                width={50}
                height={10}
              />
              <Image
                src={"/images/zikoro_logo.png"}
                alt={"zikoro logo"}
                width={50}
                height={10}
              />
            </div>
          </div>
          <div className="flex-[5%] relative">
            <Image
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              src={"/images/certificate_design.png"}
              alt={"design"}
            />
          </div>
        </div>
      </div>
      <div className="flex-1"></div>
    </section>
  );
};

export default Page;
