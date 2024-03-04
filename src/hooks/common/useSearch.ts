import React from "react";
import { useEffect, useState } from "react";

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
      const value = elm[key] as unknown;
      if (typeof value === "string") {
        return !searchTerm || value.includes(searchTerm);
      }
      return false;
    })
  );

  return { searchedData, searchTerm, setSearchTerm };
};

export default useSearch;
