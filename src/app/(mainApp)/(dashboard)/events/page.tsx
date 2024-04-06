import EventHome from "@/components/eventHome/EventHome";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

async function Page() {
  return <EventHome />;
}

 export default withPageAuthRequired(Page, { returnTo: "/events" });
