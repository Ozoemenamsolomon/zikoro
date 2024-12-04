import { Metadata } from "next";

export const metaGenerator = async ({
  params,
}: {
  params: { eventId: string };
}): Promise<Metadata> => {
  const { eventId } = params;
  // await fetch(`/api/events/${params.eventId}/event`)

  return {
    title: `Event Live ${eventId}`,
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white w-full h-full fixed overflow-y-auto">
      {children}
    </div>
  );
}
