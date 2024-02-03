import Head from "next/head";

type HeadMetaProp = {
  eventTitle?: string;
  aboutEvent?: string;
  imageLink: string;
  eventId: string | number;
};
export function HeadMeta({
  imageLink,
  eventTitle,
  aboutEvent,
  eventId,
}: HeadMetaProp) {
  return (
    <Head>
      <title>{eventTitle}</title>
      <meta name="description" content={aboutEvent} />
      <meta property="og:title" content={eventTitle} />
      <meta property="og:description" content={aboutEvent} />
      <meta property="og:image" content={imageLink} />
      <meta property="og:url" content={`https://zikoro-copy.vercel.app/published-events/${eventId}`} />
    </Head>
  );
}
