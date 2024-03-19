import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/common/useSearch";
import { useGetCertificateTemplates } from "@/hooks/services/certificate";
import { cn } from "@/lib/utils";
import { CertificateTemplate } from "@/types/certificates";
import { calculateAndSetMaxHeight, extractUniqueTypes } from "@/utils/helpers";
import React, { useEffect, useRef, useState } from "react";
import { TabProps } from "../page";
import { TFilter } from "@/types/filter";
import { useFilter } from "@/hooks/common/useFilter";
import Filter from "@/components/Filter";

const certificateTemplateFilter: TFilter<CertificateTemplate>[] = [
  {
    label: "colour",
    accessor: "colour",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="13"
        viewBox="0 0 14 13"
        fill="none"
      >
        <path
          d="M13.3245 12.3128C12.3363 10.6053 10.7851 9.40719 8.98259 8.89907C9.85894 8.4536 10.5597 7.72596 10.9719 6.83349C11.3841 5.94102 11.4837 4.93573 11.2547 3.97972C11.0257 3.02371 10.4813 2.1727 9.70945 1.56391C8.93757 0.955113 7.98316 0.624023 7.00009 0.624023C6.01703 0.624023 5.06261 0.955113 4.29074 1.56391C3.51887 2.1727 2.97453 3.02371 2.74549 3.97972C2.51645 4.93573 2.61607 5.94102 3.02828 6.83349C3.44048 7.72596 4.14125 8.4536 5.01759 8.89907C3.21509 9.40656 1.66384 10.6047 0.675719 12.3128C0.648586 12.3555 0.630368 12.4032 0.622159 12.4531C0.613951 12.503 0.615922 12.5541 0.627955 12.6032C0.639988 12.6523 0.661832 12.6985 0.692176 12.739C0.722519 12.7794 0.760734 12.8133 0.804521 12.8387C0.848308 12.864 0.896762 12.8802 0.946969 12.8863C0.997176 12.8924 1.0481 12.8882 1.09667 12.8741C1.14524 12.8601 1.19046 12.8363 1.22961 12.8043C1.26876 12.7722 1.30103 12.7326 1.32447 12.6878C2.52509 10.6134 4.64634 9.37531 7.00009 9.37531C9.35384 9.37531 11.4751 10.6134 12.6757 12.6878C12.6992 12.7326 12.7314 12.7722 12.7706 12.8043C12.8097 12.8363 12.8549 12.8601 12.9035 12.8741C12.9521 12.8882 13.003 12.8924 13.0532 12.8863C13.1034 12.8802 13.1519 12.864 13.1957 12.8387C13.2395 12.8133 13.2777 12.7794 13.308 12.739C13.3384 12.6985 13.3602 12.6523 13.3722 12.6032C13.3843 12.5541 13.3862 12.503 13.378 12.4531C13.3698 12.4032 13.3516 12.3555 13.3245 12.3128ZM3.37509 5.00031C3.37509 4.28336 3.5877 3.5825 3.98602 2.98637C4.38434 2.39024 4.95048 1.92562 5.61287 1.65125C6.27525 1.37688 7.00411 1.3051 7.7073 1.44497C8.41048 1.58484 9.05639 1.93009 9.56336 2.43705C10.0703 2.94402 10.4156 3.58993 10.5554 4.29311C10.6953 4.99629 10.6235 5.72516 10.3492 6.38754C10.0748 7.04992 9.61016 7.61607 9.01404 8.01439C8.41791 8.41271 7.71705 8.62531 7.00009 8.62531C6.03904 8.62416 5.11768 8.24187 4.43811 7.5623C3.75854 6.88273 3.37625 5.96137 3.37509 5.00031Z"
          fill="#CFCFCF"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
  },
  {
    label: "category",
    accessor: "category",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="13"
        viewBox="0 0 14 13"
        fill="none"
      >
        <path
          d="M13.3245 12.3128C12.3363 10.6053 10.7851 9.40719 8.98259 8.89907C9.85894 8.4536 10.5597 7.72596 10.9719 6.83349C11.3841 5.94102 11.4837 4.93573 11.2547 3.97972C11.0257 3.02371 10.4813 2.1727 9.70945 1.56391C8.93757 0.955113 7.98316 0.624023 7.00009 0.624023C6.01703 0.624023 5.06261 0.955113 4.29074 1.56391C3.51887 2.1727 2.97453 3.02371 2.74549 3.97972C2.51645 4.93573 2.61607 5.94102 3.02828 6.83349C3.44048 7.72596 4.14125 8.4536 5.01759 8.89907C3.21509 9.40656 1.66384 10.6047 0.675719 12.3128C0.648586 12.3555 0.630368 12.4032 0.622159 12.4531C0.613951 12.503 0.615922 12.5541 0.627955 12.6032C0.639988 12.6523 0.661832 12.6985 0.692176 12.739C0.722519 12.7794 0.760734 12.8133 0.804521 12.8387C0.848308 12.864 0.896762 12.8802 0.946969 12.8863C0.997176 12.8924 1.0481 12.8882 1.09667 12.8741C1.14524 12.8601 1.19046 12.8363 1.22961 12.8043C1.26876 12.7722 1.30103 12.7326 1.32447 12.6878C2.52509 10.6134 4.64634 9.37531 7.00009 9.37531C9.35384 9.37531 11.4751 10.6134 12.6757 12.6878C12.6992 12.7326 12.7314 12.7722 12.7706 12.8043C12.8097 12.8363 12.8549 12.8601 12.9035 12.8741C12.9521 12.8882 13.003 12.8924 13.0532 12.8863C13.1034 12.8802 13.1519 12.864 13.1957 12.8387C13.2395 12.8133 13.2777 12.7794 13.308 12.739C13.3384 12.6985 13.3602 12.6523 13.3722 12.6032C13.3843 12.5541 13.3862 12.503 13.378 12.4531C13.3698 12.4032 13.3516 12.3555 13.3245 12.3128ZM3.37509 5.00031C3.37509 4.28336 3.5877 3.5825 3.98602 2.98637C4.38434 2.39024 4.95048 1.92562 5.61287 1.65125C6.27525 1.37688 7.00411 1.3051 7.7073 1.44497C8.41048 1.58484 9.05639 1.93009 9.56336 2.43705C10.0703 2.94402 10.4156 3.58993 10.5554 4.29311C10.6953 4.99629 10.6235 5.72516 10.3492 6.38754C10.0748 7.04992 9.61016 7.61607 9.01404 8.01439C8.41791 8.41271 7.71705 8.62531 7.00009 8.62531C6.03904 8.62416 5.11768 8.24187 4.43811 7.5623C3.75854 6.88273 3.37625 5.96137 3.37509 5.00031Z"
          fill="#CFCFCF"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
  },
];

const Designs = ({ details, setValue }: TabProps) => {
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const toggleShowFilter = () =>
    setShowFilter((prevShowFilter) => !prevShowFilter);

  const divRef = useRef<HTMLDivElement>(null);
  const { certificateTemplates, isLoading, getCertificateTemplates } =
    useGetCertificateTemplates();

  console.log(certificateTemplates);

  useEffect(() => {
    if (!divRef) return;
    calculateAndSetMaxHeight(divRef);
  }, []);

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<CertificateTemplate>({
      data: certificateTemplates || [],
      dataFilters: certificateTemplateFilter || [],
    });

  const { searchTerm, searchedData, setSearchTerm } =
    useSearch<CertificateTemplate>({
      data: filteredData || [],
      accessorKey: ["category", "colour"],
    });

  useEffect(() => {
    if (isLoading || !certificateTemplates) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<CertificateTemplate>(
            certificateTemplates,
            accessor
          )
        );
      });
  }, [isLoading]);

  return (
    <>
      {" "}
      <div className="space-y-2">
        <div className="flex gap-1">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            disabled={isLoading}
            onInput={(event) => setSearchTerm(event.currentTarget.value)}
            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-xl pl-8 flex-1"
          />
          <button className="flex flex-col gap-1" onClick={toggleShowFilter}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M1.5 6.75H22.5M5.25 12H18.75M9.75 17.25H14.25"
                stroke="#001FCC"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className=" text-tiny font-medium text-ash leading-[145%] ">
              {showFilter ? "Hide" : "Show"}
            </span>
          </button>
        </div>
        <Filter
          className={`transition-all duration-150 my-4 space-y-4 ${
            showFilter ? "h-fit" : "h-0 overflow-hidden"
          }`}
          filters={filters}
          applyFilter={applyFilter}
          selectedFilters={selectedFilters}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 py-4" ref={divRef}>
        {searchedData &&
          searchedData.map(({ templateUrl, certificateTemplate }) => (
            <button
              key={certificateTemplate}
              onClick={() => setValue("background", templateUrl)}
              className={cn(
                "border-2 shadow-sm rounded-md",
                details.background === templateUrl
                  ? "border-basePrimary"
                  : "border-gray-200"
              )}
            >
              <img src={certificateTemplate} />
            </button>
          ))}
      </div>
    </>
  );
};

export default Designs;
