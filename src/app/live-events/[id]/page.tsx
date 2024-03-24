import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <SinglePublishedEvent id={id} />
    </>
  );
}
