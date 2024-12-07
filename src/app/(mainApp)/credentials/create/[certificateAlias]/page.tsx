import React from "react";
import CreateCredentialsPage from "./CreateCredentialsPage";

const page = ({
  params,
  searchParams,
}: {
  params: { certificateAlias: string };
  searchParams: { orgId: string; eventAlias: string };
}) => {
  return (
    <CreateCredentialsPage
      certificateAlias={params.certificateAlias}
      organizationId={searchParams.orgId}
      eventAlias={searchParams.eventAlias}
    />
  );
};

export default page;
