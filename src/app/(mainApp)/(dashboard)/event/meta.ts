import { Metadata } from "next";

export const metaGenerator = async ({
    params,
  }: {
    params: { eventId: string };
  }): Promise<Metadata> => {
    const id = params.eventId;
  
    const response = fetch(`https://zikoro.com/api/events/${id}/event`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  
    const eventDetail = await response;
  
    return {
      title: `${eventDetail?.data?.eventTitle || "Zikoro Event"} `,
      description: `${eventDetail?.data?.description ?? ""}`,
  
      openGraph: {
        images: [
       `${eventDetail?.data?.eventPoster}` || ""
        ],
      },
    };
  };