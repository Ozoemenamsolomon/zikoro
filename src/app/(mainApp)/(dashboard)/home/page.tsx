import Home from "@/components/userHome/Home";
 import { withPageAuthRequired } from "@auth0/nextjs-auth0";

async  function Page() {
  return <Home />;
}

export default withPageAuthRequired(Page, { returnTo: "/home" });
