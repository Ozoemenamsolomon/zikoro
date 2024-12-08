import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import { InlineIcon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";

type TopSectionProp = {
  allQuestionsCount: number;
  myQuestionsCount: number;
  awaitingReviewCount?: number;
  isAttendee?: boolean;
  activeState: number;
  setActiveState: (i:number) => void;
};

export function TopSection({
  allQuestionsCount = 0,
  awaitingReviewCount = 0,
  myQuestionsCount = 0,
  isAttendee,
  activeState, setActiveState
}: TopSectionProp) {
    
  const filters = [
    { value: "Recent", label: "Recent" },
    { value: "Top Liked", label: "Top Liked" },
  ];
  return (
    <div className="w-full overflow-x-auto no-scrollbar min-w-[900px] bg-white px-4 sm:px-6 flex items-center text-sm justify-center gap-8 sm:gap-10">
      {!isAttendee && (
        <Button className="gap-x-2 bg-basePrimary text-white font-medium rounded-lg ">
          <InlineIcon
            icon="mdi-light:television"
            fontSize={22}
            color="#ffffff"
          />
          <p>Open Presentation Mode</p>
        </Button>
      )}
      <button
      onClick={() => setActiveState(1)}
      className={cn("px-2 py-4 flex items-center gap-x-1 text-sm", activeState === 1 && "text-basePrimary border-b border-basePrimary")}>
        <p>All Questions</p>
        <span className="text-tiny font-medium px-2 py-1 flex items-center justify-center rounded-full bg-basePrimary text-white">
          {allQuestionsCount}
        </span>
      </button>
      <button
       onClick={() => setActiveState(2)}
      className={cn("px-2 py-4 flex items-center gap-x-1 text-sm", activeState === 2 && "text-basePrimary border-b border-basePrimary")}>
        <p>My Questions</p>
        <span className="text-tiny font-medium px-2 py-1 flex items-center justify-center rounded-full bg-basePrimary text-white">
          {myQuestionsCount}
        </span>
      </button>
      {!isAttendee && (
        <button 
        onClick={() => setActiveState(3)}
        className={cn("px-2 py-4 flex items-center gap-x-1 text-sm", activeState === 3 && "text-basePrimary border-b border-basePrimary")}>
          <p>Awaiting Review</p>
          <span className="text-tiny font-medium px-2 py-1 flex items-center justify-center rounded-full bg-basePrimary text-white">
            {awaitingReviewCount}
          </span>
        </button>
      )}

      <Select>
        <SelectTrigger className="h-12 w-[180px]">
          <SelectValue placeholder="Select Courses" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {filters.map(({ value, label }, index) => (
              <SelectItem
                key={index}
                className="h-12 items-center justify-start focus:bg-gray-100"
                value={value}
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
