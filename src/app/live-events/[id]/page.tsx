import SinglePublishedEvent from "@/components/published/SinglePublishedEvent";
import Head from "next/head";
export default function Page({ params: { id }, searchParams }: {searchParams:any; params: { id: string } }) {
  return (
    <>
  <Head>
    
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
  
    </Head> 
      <SinglePublishedEvent searchParams={searchParams} id={id} />
    </>
  );
}
