"use client";

import {
  TFilter,
  TFilterType,
  TOption,
  TSelectedFilter,
  applyFilterProps,
  onFilterProps,
} from "@/types/filter";
import { getProperty } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";

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

  // Memoize the filter application function to avoid unnecessary re-renders
  const applyFilters = useCallback(() => {
    let result = [...data];

    selectedFilters.forEach(({ key, value, type, onFilter }) => {
      result = result.filter((item) => {
        const pptyVal = getProperty<T>(item, key);

        if (onFilter) {
          return onFilter(item, value);
        } else {
          switch (type) {
            case "range":
              return pptyVal >= value[0] && pptyVal <= value[1];
            case "dateRange":
              return (
                (value?.from &&
                  value.to &&
                  new Date(pptyVal) >= new Date(value?.from) &&
                  new Date(pptyVal) <= new Date(value?.to)) ||
                (!value.to && new Date(pptyVal) >= new Date(value.from)) ||
                (!value.from && new Date(pptyVal) >= new Date(value.to))
              );
            case "slider":
              return pptyVal <= value;
            case "single":
              return value === pptyVal;
            default:
              return value.some((elm: any) => pptyVal && pptyVal.includes(elm));
          }
        }
      });
    });

    setFilteredData(result);
  }, [data, selectedFilters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
      (!Array.isArray(value) && value !== null && value !== "")
    ) {
      newFilters.push({
        key,
        value,
        label,
        type: type || "single",
        onFilter: onFilter || null,
      });
    }

    setSelectedFilters(newFilters);
  };

  const setOptions = (key: keyof T, options: TOption[]) => {
    setFilters((prevFilters) => {
      const newFilter = prevFilters.find((filter) => filter.accessor === key);

      if (newFilter) {
        newFilter.options = options;
        return [
          ...prevFilters.filter((filter) => filter.accessor !== key),
          newFilter,
        ];
      }

      return prevFilters;
    });
  };

  return { filteredData, filters, selectedFilters, applyFilter, setOptions };
};
