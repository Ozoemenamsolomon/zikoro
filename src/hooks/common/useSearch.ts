"use client";
import React, { useState, useMemo } from "react";

// Utility type to extract keys of T that have string values
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// Interface for the hook's props
interface UseSearchProps<T> {
  data: T[];
  accessorKey: StringKeys<T>[];
}

// Custom hook
const useSearch = <T>({ data, accessorKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Memoize the searchedData calculation for performance optimization
  const searchedData = useMemo(() => {
    console.log(searchTerm);
    return data.filter((item) =>
      accessorKey.some((key) => {
        if (!searchTerm) return true; // If searchTerm is empty, include all items

        const value = item[key];
        if (!value) return false; // If the value is undefined or null, exclude the item

        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.some((innerValue) =>
            typeof innerValue === "string"
              ? innerValue.toLowerCase().includes(searchTerm.toLowerCase())
              : false
          );
        }
        return false;
      })
    );
  }, [data, accessorKey, searchTerm]);

  return { searchedData, searchTerm, setSearchTerm };
};

export default useSearch;
