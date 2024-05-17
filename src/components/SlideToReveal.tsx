import React, { useEffect } from "react";
import { Draggable } from "agnostic-draggable";

const SlideToReveal: React.FC<{ action: () => void }> = ({ action }) => {
  useEffect(() => {
    const slider = document.getElementById("slider") as HTMLDivElement;
    const well = document.getElementById("well") as HTMLDivElement;

    new Draggable(
      document.querySelector("#slider"),
      {
        axis: "x",
        containment: "parent",
      },
      {
        "drag:stop": function () {
          console.log(
            "drag stopped",
            slider.getBoundingClientRect().right,
            well.getBoundingClientRect().right
          );
          if (
            slider.getBoundingClientRect().right <
            well.getBoundingClientRect().right - 3
          ) {
            
          } else {
            
            action();
          }
          slider.style.left = "0px";
        },
      }
    );
  }, []);

  return (
    <div
      id="well"
      className="relative p-0.5 h-fit rounded-3xl bg-basePrimary/20 select-none transition-opacity"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
        <h2 className="text-white font-medium text-center text-tiny w-full">
          Slide to Exchange Contacts
        </h2>
      </div>
      <div
        id="slider"
        className="bg-basePrimary w-fit text-white transition-all rounded-full flex justify-center items-center p-1.5"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 256 512"
          height="1.5em"
          width="1.5em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
        </svg>
      </div>
    </div>
  );
};

export default SlideToReveal;
