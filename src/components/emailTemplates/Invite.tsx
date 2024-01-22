import React from "react";

interface EmailTemplateProps {
  message: string;
}

const InviteTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => {
  return <div>{message}</div>;
};

export default InviteTemplate;
