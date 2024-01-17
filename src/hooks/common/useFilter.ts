import { useEffect, useState } from "react";
import { TSelectedFilter } from "@/types/filter";

interface UseFilterProps<T> {
  data: T[];
  filters: TSelectedFilter[];
}

export const useFilter = <T>({ data, filters }: UseFilterProps<T>) => {
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [selectedFilters, setSelectedFilters] = useState<TSelectedFilter[]>([]);

  useEffect(() => {
    let result = [...data];

    filters.forEach(({ key, value }) => {
      // Assuming `key` is the accessor and `value` is the selected values array
      result = result.filter((item) => value.includes(item[key]));
    });

    setFilteredData(result);
  }, [data, filters]);

  const setFilter = (key: string, label: string, value: any[]) => {
    const newFilters = selectedFilters.filter((filter) => filter.key !== key);

    if (value.length > 0) {
      newFilters.push({ key, value, label });
    }

    setSelectedFilters(newFilters);
  };

  return [filteredData, selectedFilters, setFilter];
};
