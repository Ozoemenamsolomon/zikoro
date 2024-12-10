import React from "react";
import CreateCredentialsPage from "./CreateCredentialsPage";

const page = ({
  params,
  searchParams,
}: {
  params: { alias: string };
  searchParams: { orgId: string; eventAlias: string; type: string };
}) => {
  console.log(params);
  return (
    <CreateCredentialsPage
      alias={params.alias}
      organizationId={searchParams.orgId}
      eventAlias={searchParams.eventAlias}
      type={searchParams.type}
    />
  );
};

export default page;
