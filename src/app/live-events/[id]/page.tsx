import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const id = (await params).id;

  const eventDetail = await fetch(`/api/events/${id}/event`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return {
    title: `${eventDetail?.data?.eventTitle} || "Live Event"`,
    description: `${eventDetail?.data?.description ?? ""}`,

    openGraph: {
      images: [
        {
          url: `${eventDetail?.data?.eventPoster}` || "",
        },
      ],
    },
  };
};

export default function Page({
  params: { id },
  searchParams,
}: {
  searchParams: any;
  params: { id: string };
}) {
  return (
    <>
      <SinglePublishedEvent searchParams={searchParams} id={id} />
    </>
  );
}
