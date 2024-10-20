import { useMeasure } from "@uidotdev/usehooks";
import React, { useState } from "react";
import Draggable from "react-draggable";

const SlideToReveal = ({ action }) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [ref, { width }] = useMeasure();
  const sliderWidth = width || 300; // Adjust this width based on your design

  const handleDrag = (e, data) => {
    // Limit the slider position within the container
    let newPosition = Math.min(Math.max(data.x, 0), sliderWidth);
    setSliderPosition(newPosition);

    if (sliderPosition >= sliderWidth) {
      action(); // Trigger the action passed as prop
      setSliderPosition(0);
    } else {
      // Reset slider position if not fully dragged
      setSliderPosition(0);
    }
  };

  return (
    <div
      id="well"
      className="relative p-0.5 h-fit rounded-3xl bg-basePrimary/20 select-none transition-opacity w-full"
      style={{ overflow: "hidden" }}
      ref={ref}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
        <h2 className="text-white font-medium text-center text-tiny w-full">
          Slide to Exchange Contacts
        </h2>
      </div>
      <Draggable
        axis="x"
        position={{ x: sliderPosition, y: 0 }}
        onDrag={handleDrag}
        onStart={() => setIsSliding(true)}
        bounds={{ left: 0, right: sliderWidth }} // Set bounds for dragging
      >
        <div
          id="slider"
          className="bg-basePrimary w-fit text-white transition-all rounded-full flex justify-center items-center p-1.5 cursor-pointer"
          style={{ transform: `translateX(${sliderPosition}px)` }} // Move the slider
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
      </Draggable>
    </div>
  );
};

export default SlideToReveal;
