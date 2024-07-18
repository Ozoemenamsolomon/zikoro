"use client";

import Image from "next/image";
import { AlertCircle } from "styled-icons/feather";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { Button } from "@/components";
import { useState } from "react";
import { Reward } from "@/types";
import { Edit } from "styled-icons/material";
import { CreateReward } from "./CreateReward";
export function RewardCard({
  reward,
  isOrganizer,
  refetch,
  attendeePoints,
}: {
  refetch: () => Promise<any>;
  isOrganizer: boolean;
  reward: Reward;
  attendeePoints: number;
}) {
  const [isAlert, setAlert] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  function onClose() {
    setOpen((prev) => !prev);
  }

  function toggleEdit() {
    setEdit((prev) => !prev);
  }

  function onAlert() {
    setAlert((alert) => !alert);
  }

  function redeem() {
    if (Number(reward?.point) > Number(attendeePoints)) {
      onAlert();
    } else {
    }
  }

  return (
    <>
      <div className="w-full text-sm h-fit pb-3 flex flex-col border rounded-md  gap-y-2 items-start">
        <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
          <Image
            src={reward?.image}
            alt="product"
            width={600}
            height={600}
            className="w-full rounded-t-md h-[180px] sm:h-56"
          />
        </div>
        <div className="w-full px-3 flex items-start justify-between">
          <div className="flex flex-col items-start justify-start">
            <p className="font-medium">{reward?.rewardTitle ?? ""}</p>
          </div>
          <div className="flex items-center gap-x-2">
            {isOrganizer && (
              <button onClick={toggleEdit}>
                <Edit size={22} className="text-gray-500" />
              </button>
            )}
            <button onClick={onClose}>
              <AlertCircle className="text-gray-600" size={22} />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col px-3 items-start justify-start">
          <div className="flex items-center gap-x-3">
            <p className="font-semibold">{`QTY: ${reward?.quantity ?? "0"}`}</p>
            <p className=" text-gray-400 ">0 redeemed</p>
          </div>
          <div className="w-full flex text-gray-500 items-center justify-between">
            <p>{`Redeem for ${reward?.point} points`}</p>
            <p>{`Available points:  ${attendeePoints}`}</p>
          </div>
        </div>
        <div className="px-3 w-full mt-1 flex items-center justify-between">
          <button
           
            onClick={redeem}
            className="text-basePrimary text-sm font-semibold"
          >
            Redeem Reward
          </button>
        </div>
      </div>
      {isEdit && (
        <CreateReward
          eventId={reward?.eventAlias}
          eventName={reward?.eventName}
          refetch={refetch}
          close={toggleEdit}
          reward={reward}
        />
      )}
      {isOpen && <RewardCardModal close={onClose} reward={reward} />}
      {isAlert && <AlertModal close={onAlert} redeemPoint={reward?.point} />}
    </>
  );
}

function RewardCardModal({
  close,
  reward,
}: {
  reward: Reward;
  close: () => void;
}) {
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[450px] box-animation h-fit max-h-[85%] overflow-y-auto flex my-10 flex-col gap-y-6 rounded-lg bg-white  mx-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-end justify-end">
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>

        <div className="w-full h-fit pb-3 flex flex-col  gap-y-2 items-start">
          <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
            <Image
              src={reward?.image}
              alt="product"
              width={600}
              height={600}
              className="w-full rounded-t-md h-[180px] sm:h-56"
            />
          </div>

          <div className="w-full flex items-start justify-start">
            <div className="flex flex-col items-start justify-start">
              <p className="font-medium">{reward?.rewardTitle ?? ""}</p>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-full">
            <div className="flex items-center gap-x-3">
              <p className="font-semibold">{`QTY: ${
                reward?.quantity ?? "0"
              }`}</p>
              <p className="font-semibold text-gray-400 line-through">
                0 redeemed
              </p>
            </div>
            <div className="w-full flex text-gray-500 items-center justify-between">
              <p>{`Redeem for ${reward?.point} points`}</p>
              <p>{`Available points:  ${reward?.point}`}</p>
            </div>
          </div>

          <p className="w-full flex-wrap  items-start justify-start leading-6 text-gray-600 text-sm">
            {"Halla"}
          </p>
          <div className=" w-full mt-1 flex items-center justify-between">
            <button
              onClick={() => {}}
              className="text-basePrimary text-sm font-semibold"
            >
              Redeem Reward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertModal({
  close,
  redeemPoint,
}: {
  close: () => void;
  redeemPoint: number;
}) {
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] max-w-lg  h-fit max-h-[85%] overflow-y-auto flex flex-col gap-y-3 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <Button onClick={close} className="px-1 self-end h-fit w-fit">
          <CloseOutline size={22} />
        </Button>


        <h2 className="w-full text-center text-basePrimary font-semibold text-base sm:text-xl">
        Oops! Not Enough Point{" "}
      </h2>
      <p className="w-full text-center ">
        You need at least <span className="font-medium">{redeemPoint}</span> points to
        redeem this reward
      </p>

      <div className="w-full flex my-3 flex-col items-start justify-start gap-y-2">
        <h2 className="text-mobile sm:text-base font-semibold">
          What can you do
        </h2>
        <ul className="list-disc space-y-2 pl-8">
          <li>Earn more points by engaging with the platform</li>
          <li>Check other reward within your poinst range</li>
        </ul>
      </div>
      <p className="font-semibold ">Keep earning! You are almost there</p>
      </div>
    
    </div>
  );
}
