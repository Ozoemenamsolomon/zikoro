import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";

export default function Page({
    params: { eventId },
  }: {
    params: { eventId: string };
  }) {

    return (
    <>
      <SinglePublishedEvent id={eventId} />
    </>
  );
}
