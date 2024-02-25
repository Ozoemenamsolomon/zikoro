import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/common/useSearch";
import { useGetCertificateTemplates } from "@/hooks/services/certificate";
import { CertificateTemplate } from "@/types/certificates";
import React from "react";

const Designs = () => {
  const { certificateTemplates, isLoading, getCertificateTemplates } =
    useGetCertificateTemplates();

  console.log(certificateTemplates);

  const { searchTerm, searchedData, setSearchTerm } =
    useSearch<CertificateTemplate>({
      data: certificateTemplates,
      accessorKey: ["templateName"],
    });

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
    </>
  );
};

export default Designs;
