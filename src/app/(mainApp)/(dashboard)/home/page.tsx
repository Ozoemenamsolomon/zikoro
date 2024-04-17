import Home from "@/components/userHome/Home";
 // import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default  function Page() {
  return <Home />;
}

// export default withPageAuthRequired(Page, { returnTo: "/home" });
