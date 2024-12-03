import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";

export default function Page({ params: { id }, searchParams }: {searchParams:any; params: { id: string } }) {
  return (
    <>
    <head>
    
        <title>
          Testing event thing
        </title>
        <meta
          name="description"
          content="I am the tester"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1727343240/bcbwh1ytyrujzebewwtg.jpg"
        />

        <meta name="author" content="Zikoro" />
  
    </head>
      <SinglePublishedEvent searchParams={searchParams} id={id} />
    </>
  );
}
