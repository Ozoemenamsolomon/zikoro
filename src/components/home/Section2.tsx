"use client";
import React, { useEffect, useState } from "react";
import { Play } from "@/constants/icons";
// import '../../../public/custom/VideoLinkHide'

export default function Section2() {
  const [showIcon, setShowIcon] = useState(true);

  const handleClick = () => {
    setShowIcon(false);
  };

  const handleVideoEnd = () => {
    setShowIcon(true);
  };

  return (
    <div className="mt-20 max-w-full mx-auto lg:max-w-6xl px-5 ">
      <p className="gradient-text font-bold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center text-2xl lg:text-4xl">
        Made for people. <br /> Built for engagements and connections.
      </p>

      <div className="bg-white p-1 lg:p-4 border-[.5px] border-indigo-800 mt-5 lg:mt-12 rounded-3xl lg:rounded-[42px]">
        {showIcon && (
          <div
            onClick={handleClick}
            className=" flex justify-center items-center w-full h-[200px] lg:h-[660px] rounded-3xl cursor-pointer inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/homeVideo.webp")' }}
          >
            <Play />
          </div>
        )}

        {!showIcon && (
          <div className="w-full h-full bg-black bg-opacity-75 z-50 flex justify-center items-center rounded-3xl">
            <video
              className="max-w-full max-h-full rounded-3xl"
              controls
              autoPlay
              onEnded={handleVideoEnd}
              style={{ minWidth: "100%", minHeight: "100%" }}
            >
              <source
                src="https://res.cloudinary.com/kachiozo/video/upload/v1712085642/ZIKORO/videos/Zikoro_video_ad_i1fzaf.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
