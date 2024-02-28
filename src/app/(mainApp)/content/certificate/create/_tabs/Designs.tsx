import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/common/useSearch";
import { useGetCertificateTemplates } from "@/hooks/services/certificate";
import { cn } from "@/lib/utils";
import { CertificateTemplate } from "@/types/certificates";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import React, { useEffect, useRef } from "react";
import { TabProps } from "../page";

const Designs = ({ details, setValue }: TabProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { certificateTemplates, isLoading, getCertificateTemplates } =
    useGetCertificateTemplates();

  console.log(certificateTemplates);

  const { searchTerm, searchedData, setSearchTerm } =
    useSearch<CertificateTemplate>({
      data: certificateTemplates,
      accessorKey: ["templateName"],
    });

  useEffect(() => {
    if (!divRef) return;
    calculateAndSetMaxHeight(divRef);
  }, []);

  return (
    <>
      {" "}
      <Input
        type="text"
        placeholder="Search by email"
        value={searchTerm}
        disabled={isLoading}
        onInput={(event) => setSearchTerm(event.target.value)}
        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-xl pl-8 w-full"
      />
      <div className="grid grid-cols-2 gap-4 py-4" ref={divRef}>
        {certificateTemplates.map(({ templateUrl }) => (
          <button onClick={() => setValue("background", templateUrl)} className={cn("border-2 shadow-sm rounded-md", details.background === templateUrl ? "border-basePrimary" : "border-gray-200")}>
            <img src={templateUrl} />
          </button>
        ))}
      </div>
    </>
  );
};

export default Designs;
