"use client";
import { Editor } from "@/components/editor/components/editor";
import {
  useGetBadge,
  useGetCertificate,
  useGetEvent,
  useSaveCertificate,
} from "@/hooks";
import React, { useEffect, useState } from "react";

const CreateCredentialsPage = ({
  alias,
  organizationId,
  eventAlias,
  type,
}: {
  alias: string;
  organizationId: string;
  eventAlias: string;
  type: "badge" | "certificate";
}) => {
  console.log(alias);
  const credentialFetchFn =
    type === "certificate" ? useGetCertificate : useGetBadge;
  const { data, isLoading } = credentialFetchFn({
    alias,
  });

  const {
    saveCertificate,
    isLoading: saving,
    error,
  } = useSaveCertificate({
    certificateAlias: alias,
  });

  const saveCredentialsFn = async (values: {
    json: string;
    height: number;
    width: number;
  }) => {
    const data = await saveCertificate({
      payload: {
        certificateAlias: alias,
        name,
        JSON: values,
      },
    });
  };

  console.log(data);

  const { event, isLoading: eventLoading } = useGetEvent({
    eventId: eventAlias,
    isAlias: true,
  });

  const [name, setName] = useState<string>("Untitled Certificate");

  //   const {} = useS

  useEffect(() => {
    if (data?.name) {
      setName(data?.name);
    }
  }, [data]);

  if (isLoading || eventLoading) return <div>Loading...</div>;

  return (
    <Editor
      initialData={data?.JSON}
      name={name}
      setName={setName}
      organizationId={organizationId}
      eventAlias={eventAlias}
      save={saveCredentialsFn}
      isSaving={saving}
      isError={error}
      event={event}
    />
  );
};

export default CreateCredentialsPage;
