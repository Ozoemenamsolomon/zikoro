"use client";
import { Editor } from "@/components/editor/components/editor";
import { useGetCertificate, useGetEvent, useSaveCertificate } from "@/hooks";
import React, { useEffect, useState } from "react";

const CreateCredentialsPage = ({
  certificateAlias,
  organizationId,
  eventAlias,
}: {
  certificateAlias: string;
  organizationId: string;
  eventAlias: string;
}) => {
  console.log(certificateAlias);
  const { certificate, isLoading } = useGetCertificate({
    certificateAlias,
  });

  const {
    saveCertificate,
    isLoading: saving,
    error,
  } = useSaveCertificate({
    certificateAlias,
  });

  const saveCertificateFn = async (values: {
    json: string;
    height: number;
    width: number;
  }) => {
    const data = await saveCertificate({
      payload: {
        ...certificate,
        certificateAlias,
        certificateName,
        certificateJSON: values,
      },
    });
  };

  console.log(certificate);

  const { event, isLoading: eventLoading } = useGetEvent({
    eventId: eventAlias,
    isAlias: true,
  });

  const [certificateName, setName] = useState<string>("Untitled Certificate");

  //   const {} = useS

  useEffect(() => {
    if (certificate?.certificateName) {
      setName(certificate?.certificateName);
    }
  }, [certificate]);

  if(isLoading) return <div>Loading...</div>

  return (
    <Editor
      initialData={certificate?.certificateJSON}
      name={certificateName}
      setName={setName}
      organizationId={organizationId}
      eventAlias={eventAlias}
      save={saveCertificateFn}
      isSaving={saving}
      isError={error}
    />
  );
};

export default CreateCredentialsPage;
