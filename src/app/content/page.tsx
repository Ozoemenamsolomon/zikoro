import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Content from "@/components/Content";

const ProtectedPage = async () => {
  return <Content />;
};
export default withPageAuthRequired(ProtectedPage, { returnTo: "/content" });
