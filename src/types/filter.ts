import React from "react";
import { DateRange } from "react-day-picker";

export interface FilterProps<T> {
  className?: string;
  applyFilter: applyFilterProps<T>;
  filters: TFilter<T>[];
  selectedFilters: TSelectedFilter<T>[];
}

export type TSelectedFilter<T> = {
  key: keyof T;
  label: string;
  value: DateRange | any[] | any;
  type?: TFilterType;
  onFilter: onFilterProps<T> | null;
};

export interface TFilter<T> {
  options?: TOption[];
  accessor: keyof T;
  label: string;
  onFilter?: onFilterProps<T>;
  type?: TFilterType;
  steps?: number;
  max?: number;
  optionsFromData?: boolean;
  icon?: React.ReactNode;
  order?: number;
  defaultValue?: T[keyof T];
}

export type TFilterType =
  | "single"
  | "multiple"
  | "range"
  | "slider"
  | "dateSingle"
  | "dateRange"
  | "boolean";

export type TOption = {
  label: string;
  value: any;
};

export type onFilterProps<T> = (data: T, value: any[] | any) => boolean;

export type applyFilterProps<T> = (
  key: keyof T,
  label: string,
  value: unknown,
  onFilter?: onFilterProps<T>,
  type?: TFilterType
) => void;

export interface FilterOptionsProps<T> {
  filter: TFilter<T>;
  selectedFilters: TSelectedFilter<T>[];
  applyFilter: applyFilterProps<T>;
}
