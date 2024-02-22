import PublishedEvent from "@/components/published/PublishedEvents";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <PublishedEvent id={id} />
    </>
  );
}
