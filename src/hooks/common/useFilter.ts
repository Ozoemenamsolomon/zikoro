import {
  TFilter,
  TFilterType,
  TOption,
  TSelectedFilter,
  applyFilterProps,
  onFilterProps,
} from "@/types/filter";
import { getProperty } from "@/utils/helpers";
import { useEffect, useState } from "react";

interface UseFilterProps<T> {
  data: T[];
  dataFilters: TFilter<T>[];
}

export const useFilter = <T>({ data, dataFilters }: UseFilterProps<T>) => {
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [filters, setFilters] = useState<TFilter<T>[]>(dataFilters);
  const [selectedFilters, setSelectedFilters] = useState<TSelectedFilter<T>[]>(
    []
  );

  useEffect(() => {
    let result = [...data];

    selectedFilters.forEach(({ key, value, type, onFilter }) => {
      // Assuming `key` is the accessor and `value` is the selected values array

      console.log(key, value, type);
      result = result.filter((item) => {
        const pptyVal = getProperty<T>(item, key);
        console.log(pptyVal, key, value, type);

        if (onFilter) {
          console.log("on filter");
          return onFilter(item, value);
        } else {
          switch (type) {
            case "multiple":
              console.log(
                "multiple",
                value.some((elm) => pptyVal && pptyVal.includes(elm))
              );
              return value.some((elm) => pptyVal && pptyVal.includes(elm));
            case "range":
              console.log("range");
              return pptyVal >= value[0] && pptyVal <= value[1];
            case "dateRange":
              console.log("dateRange");
              return pptyVal >= value.from && pptyVal <= value.to;
            case "slider":
              console.log("slider");
              return pptyVal <= value;
            default:
              console.log("single");
              return value === pptyVal;
          }
        }
      });
    });

    console.log(result, "filtered result");
    setFilteredData(result);
  }, [data, filters, selectedFilters]);

  const applyFilter: applyFilterProps<T> = (
    key,
    label,
    value,
    onFilter,
    type
  ) => {
    const newFilters = selectedFilters.filter((filter) => filter.key !== key);

    if (
      (Array.isArray(value) && value.length > 0) ||
      (!Array.isArray(value) && value)
    ) {
      newFilters.push({
        key,
        value,
        label,
        type: type || "multiple",
        onFilter: onFilter || null,
      });
    }

    setSelectedFilters(newFilters);
  };

  const setOptions = (key: string, options: TOption[]) => {
    const newFilter = filters.find((filter) => filter.accessor === key);

    if (newFilter) {
      newFilter.options = options;
      setFilters((prevFilters) => [
        ...prevFilters.filter((filter) => filter.accessor !== key),
        newFilter,
      ]);
    }
  };

  return { filteredData, filters, selectedFilters, applyFilter, setOptions };
};
