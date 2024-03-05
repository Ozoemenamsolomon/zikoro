import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link"
 async function Page() {
    return (
       <>
        <div>Home</div>
        <Link href="/api/auth/logout">Logout</Link>
       </>
    )
}

// export default Page
 export default withPageAuthRequired(Page, { returnTo: "/" });
