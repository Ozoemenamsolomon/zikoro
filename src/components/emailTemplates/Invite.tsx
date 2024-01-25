import * as React from "react";
import { Html } from "@react-email/html";
import { Button } from "@react-email/button";

interface EmailTemplateProps {
  message: string;
}

const InviteTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => {
  return <Html lang="en"></Html>;
};

export default InviteTemplate;
