import { useGetCertificateTemplates } from "@/hooks/services/certificate";
import React from "react";

const Certificates = () => {
  const { certificateTemplates, isLoading, getCertificateTemplates } =
    useGetCertificateTemplates();

  console.log(certificateTemplates);

  return <div>Certificates</div>;
};

export default Certificates;
