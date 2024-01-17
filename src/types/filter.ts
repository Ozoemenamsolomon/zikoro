export interface FilterProps {
  className: string;
  onFilter: (key: string, label: string, value: any[]) => void;
  filters: TFilterType[];
  selectedFilters: TSelectedFilter[];
}

export type TSelectedFilter = {
  key: string;
  label: string;
  value: any[];
};

export interface FilterOptionProps {
  option: string;
  accessor: string;
  label: string;
  onFilter?: (accessor: string, label: string, value: any[]) => void;
  selectedFilters: TSelectedFilter[];
  type?: "single" | "multiple" | "range";
}
