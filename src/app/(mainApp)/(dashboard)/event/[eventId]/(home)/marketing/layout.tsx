import React from "react";
import MarketingLayout from "./_components/MarketingLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <MarketingLayout>{children}</MarketingLayout>;
};

export default Layout;
