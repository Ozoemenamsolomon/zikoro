"use-client";

import { Button } from "@/components";
import Image from "next/image";
import { interactionList } from "..";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
export function InteractionsSelectionModal({
  close,
  toggleQuiz,
}: {
  close: () => void;
  toggleQuiz: () => void;
}) {
  return (
    <div className="w-full h-full z-[999999] bg-white/50 fixed inset-0">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" w-[95%] max-w-4xl absolute shadow inset-0 h-fit px-4 sm:px-6 py-4 rounded-lg bg-white m-auto max-h-[85%]"
      >
        <div className="w-full flex items-end justify-end mb-3">
          <Button onClick={close} className="px-0 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interactionList.map((item) => (
            <Button
              onClick={toggleQuiz}
              key={item.image}
              className="w-full rounded-lg gap-x-2 items-start justify-start h-full px-0 p-3 border hover:border-basePrimary"
            >
              <Image
                src={item.image}
                alt="interactions"
                width={80}
                height={80}
                className="w-[3.7rem] h-[3.7rem]"
              />
              <div className="flex flex-col items-start justify-start gap-y-1">
                <p className="font-semibold text-sm sm:text-base">
                  {item.header}
                </p>
                <p className="text-xs text-start sm:text-sm">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
