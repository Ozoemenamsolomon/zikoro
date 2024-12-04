import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";
import { Metadata } from "next";

export const metaGenerator = async ({ params }: { params: { eventId: string } }): Promise<Metadata> => {

   await fetch(`/api/events/${params.eventId}/event`)


	return {
		
		openGraph:{
            type: "website",
            url: "https://example.com",
            title: "My Website",
            description: "My Website Description",
            siteName: "My Website",
            images: [{
              url: "https://example.com/og.png",
            }],
          }
	};
};


export default function Page({ params: { id }, searchParams }: {searchParams:any; params: { id: string } }) {
  return (
    <>

      <SinglePublishedEvent searchParams={searchParams} id={id} />
    </>
  );
}
