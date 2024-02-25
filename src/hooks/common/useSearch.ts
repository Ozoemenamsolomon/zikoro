import React from "react";
import { useEffect, useState } from "react";

interface UseSearchProps<T> {
  data: T[];
  accessorKey: (keyof T)[];
}

const useSearch = <T>({ data, accessorKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  console.log(searchTerm);

  const searchedData = data.filter((elm) =>
    accessorKey.some((key) => !searchTerm || elm[key].includes(searchTerm))
  );

  return { searchedData, searchTerm, setSearchTerm };
};

export default useSearch;
