"use client";
import { AngleDown } from "@styled-icons/fa-solid/AngleDown";
import { manrope } from "@/lib/fonts";
import {COUNTRY_CODE} from "@/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

const industryType: string[] = [
  "Medical",
  "Technology",
  "Business",
  "Marketing",
  "Training & Education",
  "Entertainment & media",
  "Science & Research",
  "Wellness, Health and Fitness",
  "Banking & Finance",
  "Engineering",
  "Building & Construction",
  "Animals & Pets",
  "Hospitality",
  "Food & Beverages",
  "Arts & Crafts",
  "Agriculture & Forestry",
  "Energy",
  "Beauty & Fashion",
  "Environment & Waste",
  "Logistics & Transportation",
  "Home & Office",
  "Security & Defense",
  "Travel & Tourism",
  "Telecommunication",
  "Others",
];

export const CustomSelect: React.FC<{
  label?: string;
  id: string;
  placeholder?: string;
  value?: string;
  name: string;
  containerClassName?: string;
  onValueChange?(value: string): void;
}> = ({
  label,
  placeholder,
  value,
  containerClassName,
  name,
  onValueChange,
}) => {
  return (
    <Select name={name} onValueChange={onValueChange} required>
      <SelectTrigger
        className={`text-[#3E404B] relative h-14 w-full bg-white border border-[#f3f3f3] sm:text-sm data-[placeholder]:text-[#b3b1b1] ${containerClassName}`}
      >
        <label
          className={`${manrope.className} px-2 font-medium block text-[12px] bg-white text-[#3E404B] absolute right-2 -top-2.5 rounded-sm`}
        >
          {label}
        </label>
        <SelectValue placeholder={placeholder} />
        <SelectContent>
          {label === "Country"
            ? COUNTRY_CODE?.map((country, index) => {
                return (
                  <SelectItem key={index} value={country.name}>
                    {country.name}
                  </SelectItem>
                );
              })
            : label === "Industry"
            ? industryType.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : null}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};
