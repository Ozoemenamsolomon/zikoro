import React from "react";
import { useEffect, useState } from "react";

interface UseSearchProps<T extends Record<string, string>> {
  data: T[];
  accessorKey: (keyof T)[];
}

const useSearch = <T extends Record<string, string>>({
  data,
  accessorKey,
}: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  console.log(searchTerm);

  const searchedData = data.filter((elm) =>
    accessorKey.some((key) => !searchTerm || elm[key].includes(searchTerm))
  );

  return { searchedData, searchTerm, setSearchTerm };
};

export default useSearch;
