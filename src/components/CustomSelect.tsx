"use client";
import { AngleDown } from "@styled-icons/fa-solid/AngleDown";

export const CustomSelect: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  classname?: string;
}> = ({ label, placeholder, value, classname }) => {
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
  const pricingCurrency: string[] = ["Dollar", "Naira"];
  const certificateHeading: string[] = [
    "Biomechanics of foot ulcer worksop",
    "Resin art workshop",
    "Biomechanics of lower limbs",
  ];

  return (
    <div
      className={`p-[10px] rounded-md border border-[#f3f3f3] relative ${classname}`}
    >
      <AngleDown
        size={15}
        className="absolute right-0 translate-y-1 -translate-x-5 pointer-events-none text-gray-300"
      />
      <label className="block text-[12px] bg-white text-gray-700 absolute right-2 bottom-9 p-1 rounded-sm">
        {label}
      </label>
      <select
        className="w-full bg-white border-0 sm:text-sm focus:border-0 outline-0"
        placeholder="Please select"
        required
      >
        <option value="" className="text-gray-500" hidden disabled selected>
          {placeholder}
        </option>
        {label === "Event visibilty"
          ? visibilityOptions.map((optionValue, index) => {
              return (
                <>
                  <option key={index} value={value} className="m-4">
                    {optionValue}
                  </option>
                </>
              );
            })
          : label === "Event category"
          ? categoryOptions.map((optionValue, index) => {
              return (
                <option key={index} value={value}>
                  {optionValue}
                </option>
              );
            })
          : label === "Industry"
          ? industryType.map((optionValue, index) => {
              return (
                <option key={index} value={value}>
                  {optionValue}
                </option>
              );
            })
          : label === "Location type"
          ? locationType.map((optionValue, index) => {
              return (
                <option key={index} value={value}>
                  {optionValue}
                </option>
              );
            })
          : label === "Certificate heading"
          ? certificateHeading.map((optionValue, index) => {
              return (
                <option key={index} value={value}>
                  {optionValue}
                </option>
              );
            })
          : pricingCurrency.map((optionValue, index) => {
              return (
                <option key={index} value={value}>
                  {optionValue}
                </option>
              );
            })}
      </select>
    </div>
  );
};
