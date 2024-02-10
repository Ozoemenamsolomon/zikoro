import { Button } from "@/components";
import Image from "next/image";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/constants";
import { useState } from "react";

export function Speakers() {
  const [active, setActive] = useState(1);

  function changeActiveState(active: number) {
    setActive(active);
  }
  return (
    <>
      {active === 1 && (
        <div className=" w-full flex  gap-4 items-center flex-wrap justify-center p-4 sm:p-6">
          {[1, 2, 3, 4, 5, 6].map((_) => (
            <SpeakerWidget key={_} changeActiveState={changeActiveState} />
          ))}
        </div>
      )}
      {active === 2 && <SpeakerInfo changeActiveState={changeActiveState} />}
    </>
  );
}

function SpeakerWidget({
  changeActiveState,
}: {
  changeActiveState: (v: number) => void;
}) {
  return (
    <div className="w-[250px] flex flex-col gap-y-2 items-center justify-center p-4 border rounded-lg">
      <Image
        src="/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"
        width={300}
        height={300}
        className="rounded-full w-24 h-24"
        alt="speaker"
      />
      <button className=" flex items-center justify-center w-fit bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-b-md">
        Moderator
      </button>
      <div className="flex  items-center flex-col justify-center">
        <h2 className="font-semibold text-gray-500 text-xl">John Doe</h2>
        <p className="text-gray-500">Product Designer</p>
        <p className="text-gray-500">OrthoEx</p>
      </div>

      <Button
        onClick={() => changeActiveState(2)}
        className="px-0 h-fit w-fit  bg-none  text-mobile"
      >
        <span className="text-zikoro">View Profile</span>
      </Button>
    </div>
  );
}

function SpeakerInfo({
  changeActiveState,
}: {
  changeActiveState: (v: number) => void;
}) {
  return (
    <div className="w-full px-3 flex flex-col gap-y-4 items-start justify-start">
      <Button
        onClick={() => changeActiveState(1)}
        className="px-0 h-fit w-fit  bg-none  "
      >
        <ArrowBack className="px-1" size={22} />
        <span>Back to Speakers</span>
      </Button>

      <div className="flex flex-col md:flex-row gap-4 items-center md:items-start w-full">
        <SpeakerWidget changeActiveState={changeActiveState} />

        <div className="w-full md:w-[70%] flex flex-col gap-y-2 items-start justify-start pb-4 border rounded-lg">
          <h2 className="px-3 font-semibold w-full border-b py-3">Profile</h2>

          <div className="px-3 flex flex-col gap-y-2 mt-2 items-start justify-start">
            <h2 className=" font-semibold ">Bio</h2>
            <div className="flex flex-wrap w-full text-mobile text-gray-600 items-start justify-start">
              I'm an enthusiastic and goal driven professional with passion to
              help people lead quality lives. With a background in Biomechanics,
              Sports and Medical Technology, I analyse and optimize human
              performance at work, during sports and activity of daily living;
              including human interractions with technical devices.
            </div>
          </div>

          <div className="px-3 flex flex-col gap-y-2 mt-2 items-start justify-start">
            <h2 className=" font-semibold ">Location</h2>
            <div className="flex flex-wrap w-full text-mobile text-gray-600 items-start justify-start">
              Ikeja, Nigeria
            </div>
          </div>

          <div className="px-3 flex flex-col gap-y-2 mt-2 items-start justify-start">
            <h2 className=" font-semibold ">Social Media</h2>
            <div className="flex items-center gap-x-3">
              <TwitterIcon />
              <LinkedinIcon />
              <FacebookIcon />
              <InstagramIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
