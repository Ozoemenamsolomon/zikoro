import React from "react";
import CreateCredentialsPage from "./CreateCredentialsPage";

const page = ({
  params,
  searchParams,
}: {
  params: { certificateAlias: string };
  searchParams: { orgId: string };
}) => {
  return (
    <CreateCredentialsPage
      certificateAlias={params.certificateAlias}
      organizationId={searchParams.orgId}
    />
  );
};

export default page;
