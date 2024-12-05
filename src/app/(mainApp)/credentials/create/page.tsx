import React from "react";
import CreateCredentialsPage from "./CreateCredentialsPage";

const page = ({ params }: { params: { certificateAlias: string } }) => {
  return <CreateCredentialsPage certificateAlias={params.certificateAlias} />;
};

export default page;
