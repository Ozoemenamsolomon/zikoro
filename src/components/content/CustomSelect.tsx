"use client";
import { AngleDown } from "@styled-icons/fa-solid/AngleDown";
import { manrope } from "@/utils/fonts";
import { useState } from "react";
import axios from "axios";
import { COUNTRY_CODE } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

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
  const visibilityOptions: string[] = ["Public", "Private"];
  const categoryOptions: string[] = [
    "Conferences",
    "Tradeshows & Exhibition",
    "Seminar & Workshops",
    "Networking",
    "Cultural & Arts",
    "Celebrations",
    "Sports",
    "Job Fairs",
    "Festivals",
    "Charity",
  ];
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
  const locationType: string[] = ["Onsite", "Virtual", "Hybrid"];
  const pricingCurrency: string[] = ["USD", "NGN", "GHC", "ZAR", "KES"];
  const certificateHeading: string[] = [
    "Biomechanics of foot ulcer worksop",
    "Resin art workshop",
    "Biomechanics of lower limbs",
  ];
  const session: string[] = ["session 1", "session 2", "session 3"];
  const track: string[] = ["track 1", "track 2", "track 3"];

  return (
    <Select name={name} onValueChange={onValueChange}>
      <SelectTrigger
        className={`relative h-14 w-full bg-white border border-[#f3f3f3] sm:text-sm data-[placeholder]:text-[#c4c2c2] ${containerClassName}`}
      >
        <label
          className={`${manrope.className} font-medium block text-[12px] bg-white text-gray-700 absolute right-2 -top-2.5 rounded-sm`}
        >
          {label}
        </label>
        <SelectValue placeholder={placeholder} />
        <SelectContent>
          {label === "Event visibilty"
            ? visibilityOptions.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : label === "Event category"
            ? categoryOptions.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : label === "Country" || label === "Event country"
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
            : label === "Location type"
            ? locationType.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : label === "Certificate heading"
            ? certificateHeading.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : label === "Session"
            ? session.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : label === "Track"
            ? track.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })
            : pricingCurrency.map((optionValue, index) => {
                return (
                  <SelectItem key={index} value={optionValue}>
                    {optionValue}
                  </SelectItem>
                );
              })}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};
