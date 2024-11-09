import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib";
import { FilterOptionsProps, FilterProps } from "@/types/filter";
import React, { useEffect } from "react";

function MultipleFilter<T>({
  filter,
  selectedFilters,
  applyFilter,
}: FilterOptionsProps<T>) {
  const { type, accessor, onFilter, label: filterLabel } = filter;

  return (
    <>
      {filter.options &&
        filter.options.map(({ label, value }) => (
          <div className="flex text-gray-700 items-center gap-2 capitalize font-medium">
            <Checkbox
              className="data-[state=checked]:bg-basePrimary"
              id={label}
              checked={
                selectedFilters
                  .find(({ key }) => key === accessor)
                  ?.value.includes(value) || false
              }
              onCheckedChange={(checked) => {
                const index = selectedFilters.findIndex(
                  (filter) => filter.key === accessor
                );
                const prevValue =
                  index !== -1 ? selectedFilters[index].value : [];
                const newValue = checked
                  ? [...prevValue, value]
                  : prevValue.filter((selected: any) => selected !== value);

                applyFilter(accessor, filterLabel, newValue, onFilter, type);
              }}
            />
            <Label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={label}
            >
              {label}
            </Label>
          </div>
        ))}
    </>
  );
}

function DateRangeFilter<T>({
  filter,
  selectedFilters,
  applyFilter,
}: FilterOptionsProps<T>) {
  const { type, accessor, onFilter, label: filterLabel } = filter;
  const date = selectedFilters.find(({ key }) => key === accessor);

  return (
    <Calendar
      mode="range"
      selected={date?.value}
      onSelect={(value) =>
        applyFilter(accessor, filterLabel, value, onFilter, type)
      }
      className="rounded-md border"
    />
  );
}

function SliderFilter<T>({
  filter,
  selectedFilters,
  applyFilter,
}: FilterOptionsProps<T>) {
  const { type, accessor, onFilter, label: filterLabel } = filter;
  const slideValue = selectedFilters.find(({ key }) => key === accessor);

  return (
    <div className="space-y-2 py-2">
      <div className="flex text-sm text-gray-600 justify-between">
        <span>{slideValue?.value[0] || 0}</span>
      </div>
      <Slider
        onValueChange={(value) =>
          applyFilter(accessor, filterLabel, value, onFilter, type)
        }
        defaultValue={slideValue?.value || [filter?.max]}
        max={filter?.max}
        step={filter?.steps}
      />
    </div>
  );
}

function RangeFilter<T>({
  filter,
  selectedFilters,
  applyFilter,
}: FilterOptionsProps<T>) {
  const { type, accessor, onFilter, label: filterLabel } = filter;
  const range = selectedFilters.find(({ key }) => key === accessor);

  return (
    <div className="space-y-2 py-2">
      <div className="flex text-sm text-gray-600 justify-between">
        <span>{range?.value[0] || 0}</span>
        <span>{range?.value[1] || filter?.max}</span>
      </div>
      <Slider
        onValueChange={(value) =>
          applyFilter(accessor, filterLabel, value, onFilter, type)
        }
        defaultValue={range?.value || [0, filter?.max]}
        max={filter?.max}
        step={filter?.steps}
      />
    </div>
  );
}

function SingleFilter<T>({
  filter,
  selectedFilters,
  applyFilter,
}: FilterOptionsProps<T>) {
  const { defaultValue, type, accessor, onFilter, label: filterLabel } = filter;
  const singleValue = selectedFilters.find(({ key }) => key === accessor);

  useEffect(() => {
    if (!defaultValue) return;

    applyFilter(accessor, filterLabel, defaultValue, onFilter, type);
  }, []);

  return (
    <RadioGroup
      onValueChange={(value) =>
        applyFilter(accessor, filterLabel, value, onFilter, type)
      }
      defaultValue={defaultValue || singleValue?.value}
    >
      <div className="flex items-center space-x-2 mb-2">
        <RadioGroupItem
          className="data-[state=checked]:bg-basePrimary"
          value={""}
          id={"unset"}
        />
        <Label htmlFor={"unset"}>unset</Label>
      </div>
      {filter?.options &&
        filter?.options.map(({ label, value }) => (
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem
              className="data-[state=checked]:bg-basePrimary"
              value={value}
              id={label}
            />
            <Label htmlFor={value}>{label}</Label>
          </div>
        ))}
    </RadioGroup>
  );
}

// const FilterOptions: React.FC<FilterOptionsProps<T>> = React.memo(
//   ({ filter, selectedFilters, applyFilter }) => {
//     const { type, accessor, onFilter, label: filterLabel } = filter;

//     switch (type) {
//       case "range":
//         return (
//           <RangeFilter
//             filter={filter}
//             selectedFilters={selectedFilters}
//             applyFilter={applyFilter}
//           />
//         );

//       case "dateRange":
//         return (
//           <DateRangeFilter
//             filter={filter}
//             selectedFilters={selectedFilters}
//             applyFilter={applyFilter}
//           />
//         );

//       case "slider":
//         return (
//           <SliderFilter
//             filter={filter}
//             selectedFilters={selectedFilters}
//             applyFilter={applyFilter}
//           />
//         );

//       case "single":
//         return (
//           <SingleFilter
//             filter={filter}
//             selectedFilters={selectedFilters}
//             applyFilter={applyFilter}
//           />
//         );

//       default:
//         return (
//           <MultipleFilter
//             filter={filter}
//             selectedFilters={selectedFilters}
//             applyFilter={applyFilter}
//           />
//         );
//     }
//   }
// );
function FilterOptions<T>({
  filter,
  selectedFilters,
  applyFilter,
}: FilterOptionsProps<T>) {
  const { type, accessor, onFilter, label: filterLabel } = filter;

  switch (type) {
    case "range":
      return (
        <RangeFilter
          filter={filter}
          selectedFilters={selectedFilters}
          applyFilter={applyFilter}
        />
      );

    case "dateRange":
      return (
        <DateRangeFilter
          filter={filter}
          selectedFilters={selectedFilters}
          applyFilter={applyFilter}
        />
      );

    case "slider":
      return (
        <SliderFilter
          filter={filter}
          selectedFilters={selectedFilters}
          applyFilter={applyFilter}
        />
      );

    case "single":
      return (
        <SingleFilter
          filter={filter}
          selectedFilters={selectedFilters}
          applyFilter={applyFilter}
        />
      );

    default:
      return (
        <MultipleFilter
          filter={filter}
          selectedFilters={selectedFilters}
          applyFilter={applyFilter}
        />
      );
  }
}

function Filter<T>({
  className,
  filters,
  applyFilter,
  selectedFilters,
}: FilterProps<T>) {
  return (
    <div className={className}>
      <Menubar className="flex justify-between px-1 border-0 !bg-transparent">
        {filters.map((filter, index) => {
          const { label, accessor, options, icon } = filter;
          return (
            <MenubarMenu key={accessor as unknown as string}>
              <MenubarTrigger
                className={cn(
                  "flex gap-0.5 items-center w-full min-w-fit justify-center px-0.5 !bg-transparent",
                  index > 0 && "border-l-[1px]"
                )}
              >
                {icon}
                <span className="text-xs font-medium text-gray-700 capitalize">
                  {label}
                </span>
              </MenubarTrigger>
              <MenubarContent className="space-y-2 w-fit max-h-[250px] overflow-auto">
                <FilterOptions<T>
                  filter={filter}
                  selectedFilters={selectedFilters}
                  applyFilter={applyFilter}
                />
              </MenubarContent>
            </MenubarMenu>
          );
        })}
      </Menubar>
      <div className="flex gap-2 flex-wrap px-2 justify-center">
        {selectedFilters.map(({ label, key }) => (
          <div
            key={label}
            className="text-tiny text-earlyBirdColor flex items-center gap-1.5 p-1 rounded bg-[#EEF0FF] w-fit"
          >
            <span className="font-medium capitalize">{label}</span>
            <button onClick={() => applyFilter(key, label, [])}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 17 16"
                fill="none"
              >
                <path
                  d="M12.6999 3.80682C12.6382 3.74501 12.565 3.69598 12.4843 3.66253C12.4037 3.62907 12.3172 3.61185 12.2299 3.61185C12.1426 3.61185 12.0561 3.62907 11.9755 3.66253C11.8948 3.69598 11.8216 3.74501 11.7599 3.80682L8.49991 7.06015L5.23991 3.80015C5.17818 3.73843 5.10491 3.68947 5.02427 3.65606C4.94362 3.62266 4.85719 3.60547 4.76991 3.60547C4.68262 3.60547 4.59619 3.62266 4.51554 3.65606C4.4349 3.68947 4.36163 3.73843 4.2999 3.80015C4.23818 3.86187 4.18922 3.93514 4.15582 4.01579C4.12242 4.09643 4.10522 4.18286 4.10522 4.27015C4.10522 4.35744 4.12242 4.44387 4.15582 4.52451C4.18922 4.60515 4.23818 4.67843 4.2999 4.74015L7.55991 8.00015L4.2999 11.2601C4.23818 11.3219 4.18922 11.3951 4.15582 11.4758C4.12242 11.5564 4.10522 11.6429 4.10522 11.7301C4.10522 11.8174 4.12242 11.9039 4.15582 11.9845C4.18922 12.0652 4.23818 12.1384 4.2999 12.2001C4.36163 12.2619 4.4349 12.3108 4.51554 12.3442C4.59619 12.3776 4.68262 12.3948 4.76991 12.3948C4.85719 12.3948 4.94362 12.3776 5.02427 12.3442C5.10491 12.3108 5.17818 12.2619 5.23991 12.2001L8.49991 8.94015L11.7599 12.2001C11.8216 12.2619 11.8949 12.3108 11.9755 12.3442C12.0562 12.3776 12.1426 12.3948 12.2299 12.3948C12.3172 12.3948 12.4036 12.3776 12.4843 12.3442C12.5649 12.3108 12.6382 12.2619 12.6999 12.2001C12.7616 12.1384 12.8106 12.0652 12.844 11.9845C12.8774 11.9039 12.8946 11.8174 12.8946 11.7301C12.8946 11.6429 12.8774 11.5564 12.844 11.4758C12.8106 11.3951 12.7616 11.3219 12.6999 11.2601L9.4399 8.00015L12.6999 4.74015C12.9532 4.48682 12.9532 4.06015 12.6999 3.80682Z"
                  fill="#001FCC"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;
