import EventHome from "@/components/eventHome/EventHome";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Page() {
  return <EventHome />;
}

// withPageAuthRequired(Page, { returnTo: "/events" });
