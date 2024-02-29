import { withPageAuthRequired } from "@auth0/nextjs-auth0";
 async function Page() {
    return (
        <div>Home</div>
    )
}


export default withPageAuthRequired(Page, { returnTo: "/events" });
