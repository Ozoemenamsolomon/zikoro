import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/common/useSearch";
import { useGetBadgeTemplates } from "@/hooks/services/badge";
import { cn } from "@/lib/utils";
import { BadgeTemplate } from "@/types/badge";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import React, { useEffect, useRef } from "react";
import { TabProps } from "../page";

const Designs = ({ details, setValue }: TabProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { badgeTemplates, isLoading, getBadgeTemplates } =
    useGetBadgeTemplates();

  console.log(badgeTemplates);

  const { searchTerm, searchedData, setSearchTerm } = useSearch<BadgeTemplate>({
    data: badgeTemplates || [],
    accessorKey: ["templateName"],
  });

  useEffect(() => {
    if (!divRef) return;
    calculateAndSetMaxHeight(divRef);
  }, []);

  return (
    <>
      {" "}
      <Input
        type="text"
        placeholder="Search"
        value={searchTerm}
        disabled={isLoading}
        onInput={(event) => setSearchTerm(event.currentTarget.value)}
        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-xl pl-8 w-full"
      />
      <div className="grid grid-cols-2 gap-4 py-4" ref={divRef}>
        {badgeTemplates &&
          badgeTemplates.map(({ BadgeUrl, BadgeTemplate }) => (
            <button
              key={BadgeTemplate}
              onClick={() => setValue("background", BadgeUrl)}
              className={cn(
                "border-2 shadow-sm rounded-md",
                details.background === BadgeUrl
                  ? "border-basePrimary"
                  : "border-gray-200"
              )}
            >
              <img src={BadgeTemplate} />
            </button>
          ))}
      </div>
    </>
  );
};

export default Designs;
