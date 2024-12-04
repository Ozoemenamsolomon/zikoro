import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";


export default function Page({ params: { id }, searchParams }: {searchParams:any; params: { id: string } }) {
  return (
    <>

      <SinglePublishedEvent searchParams={searchParams} id={id} />
    </>
  );
}
