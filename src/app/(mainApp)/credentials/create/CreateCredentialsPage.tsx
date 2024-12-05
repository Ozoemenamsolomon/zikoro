"use client";
import { Editor } from "@/components/editor/components/editor";
import { useGetCertificate } from "@/hooks";
import React, { useEffect, useState } from "react";

const CreateCredentialsPage = ({
  certificateAlias,
}: {
  certificateAlias: string;
}) => {
  const { certificate, isLoading } = useGetCertificate({
    certificateAlias,
  });

  const [certificateName, setName] = useState<string>("Untitled Certificate");

  //   const {} = useS

  useEffect(() => {
    if (certificate?.certificateName) {
      setName(certificate?.certificateName);
    }
  }, [certificate]);

  return (
    <Editor
      initialData={certificate?.certificateJSON}
      name={certificate?.certificateName}
      setName={setName}
    />
  );
};

export default CreateCredentialsPage;
