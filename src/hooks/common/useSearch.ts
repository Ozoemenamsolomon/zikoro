"use client"
import React from "react";
import {  useState } from "react";

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface UseSearchProps<T> {
  data: T[];
  accessorKey: StringKeys<T>[]; // Use StringKeys<T> instead of (keyof T extends string)[]
}

const useSearch = <T>({ data, accessorKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchedData = data.filter((elm) =>
    accessorKey.some((key) => {
      if (!searchTerm) return true;

      const value = elm[key] as unknown;
      if (!value) return false;

      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (Array.isArray(value)) {
        return value.some((innerElm) =>
          innerElm.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    })
  );

  console.log(searchedData, data, "search data");
  return { searchedData, searchTerm, setSearchTerm };
};

export default useSearch;
