"use client";
import React, { useEffect, useState } from "react";
import Picture from "./AwaitAppPic";
import Toggler from "../svg/Toggler";
import TogglerBlue from "../svg/TogglerBlue";

import { supabase } from "../../utils/Utils";
import { toast } from "react-toastify";

type AwaitAppPicsProps = {
  url: string;
  id: number;
  photoUrl: string;
};

export default function AwaitAppPics() {
  const [togOn, setTogOn] = useState(false);
  const [images, setImages] = useState<AwaitAppPicsProps[] | undefined>(
    undefined
  );

  //toggler function
  const toggler = () => {
    setTogOn(!togOn);
  };

  //autoApprove Function
  const autoApprove = async () => {
    toggler();

    fetch("/api/fetchImages/fetchAwaitingImages/autoApprove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => console.error("Error:", error));
  };

  //Fetch Function
  async function fetchImageUrls() {
    fetch("/api/fetchImages/fetchAwaitingImages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // You might need additional headers like authorization if required
      },
    })
      .then((response) => response.json())
      .then((data) => setImages(data.data))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    fetchImageUrls();
  }, []);

  return (
    <div className="mt-12">
      <div className="flex justify-between mb-4 ">
        <p className="text-xl font-medium">Awaiting Approval</p>
        <div className="hidden lg:flex font-medium space-x-2 items-center mr-4">
          {togOn ? (
            <div className="cursor-pointer" onClick={toggler}>
              <TogglerBlue />
            </div>
          ) : (
            <div className="cursor-pointer" onClick={autoApprove}>
              <Toggler />
            </div>
          )}

          <p className="text-base ">Auto Approve</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images?.length ? (
          images?.map((image, index) => (
            <Picture key={index} id={image.id} url={image.photoUrl} />
          ))
        ) : (
          <p className="text-gray-500">No Pictures Available</p>
        )}
      </div>
    </div>
  );
}
