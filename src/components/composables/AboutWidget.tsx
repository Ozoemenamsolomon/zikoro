import { ReactNode } from "react";
export function AboutWidget({ Icon, text }: { Icon: any; text: string | ReactNode }) {
    return (
      <div className="flex items-center text-sm gap-x-2">
        <Icon className="text-gray-600" size={16} />
        {text}
      </div>
    );
  }