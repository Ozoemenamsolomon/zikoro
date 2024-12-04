import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
params: Promise<{ id: string }>
}): Promise<Metadata> => {
  const id = (await params).id
  // await fetch(`/api/events/${params.eventId}/event`)

  return {
    title: `Event Live ${id}`,
    description: "Olaoogergerger",

    // openGraph:{
    //         type: "website",
    //         url: "https://example.com",
    //         title: "My Website",
    //         description: "My Website Description",
    //         siteName: "My Website",
    //         images: [{
    //           url: "https://example.com/og.png",
    //         }],
    //       }
  };
};

export default function Page({ params: { id }, searchParams }: {searchParams:any; params: { id: string } }) {
  return (
    <>

      <SinglePublishedEvent searchParams={searchParams} id={id} />
    </>
  );
}
