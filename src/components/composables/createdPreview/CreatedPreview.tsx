import { useMemo } from "react";
import { Button } from "@/components";
import { cn } from "@/lib";
import { CheckCircleFill } from "styled-icons/bootstrap";
import { CloseOutline } from "styled-icons/evaicons-outline";

export function CreatedPreview({ color, name, remove }: { remove?:() => Promise<void>; color?: string; name: string }) {
    const rgba = useMemo(
      (alpha = 0.1) => {
      if (color) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
 
      },
      [color]
    );
    return (
      <Button
        style={{ backgroundColor: rgba, color }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={cn(
          `relative  rounded-none bg-opacity-20  `,
          "" === name && "border-basePrimary border"
        )}
      >
        <span className="font-medium capitalize"> {name}</span>
        <div
          className="absolute top-[-14px] right-[-13px]"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          {"" === name ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault()
              }}
            >
              <CheckCircleFill className="text-basePrimary" size={16} />
            </button>
          ) : (
            <button 
            onClick={remove}
            className="rounded-full p-1 bg-gray-100 flex items-center justify-center">
              <CloseOutline className="text-[#717171]" size={16} />
            </button>
          )}
        </div>
      </Button>
    );
  }
  