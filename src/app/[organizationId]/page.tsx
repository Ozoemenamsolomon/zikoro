import OrganizationHome from "@/components/home/OrganizationHome";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0";


 function Page({ params: { organizationId } }: { params: { organizationId: string } }) {
 return <OrganizationHome organizationId={organizationId}/>
}


export default Page


//  withPageAuthRequired(Page, {returnTo: "/"})