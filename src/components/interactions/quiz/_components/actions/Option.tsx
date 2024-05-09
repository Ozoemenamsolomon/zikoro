"use client";

import { QUsers } from "@/constants";
import { cn } from "@/lib";
import { CloseCircle } from "@styled-icons/ionicons-sharp/CloseCircle";
import { CheckCircleFill } from "@styled-icons/bootstrap/CheckCircleFill";
export function Option({ isCorrect }: { isCorrect: boolean }) {
  return (
    <button
      className={cn(
        "w-full px-4 text-gray-500 flex items-center justify-between h-12 rounded-md border border-gray-500 bg-gray-100",
        isCorrect && "border-basePrimary bg-basePrimary/10"
      )}
    >
      {isCorrect ? (
        <CheckCircleFill className="text-green-500" size={20} />
      ) : (
        <CloseCircle className="text-red-500" size={20} />
      )}
      <div className="text-mobile flex items-center gap-x-2">
        <span>20%</span>
        <span className="flex items-center gap-x-2">
          <QUsers />
          <p>35</p>
        </span>
      </div>
    </button>
  );
}
