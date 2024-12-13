import FullPost from "@/components/post/FullPost";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> => {
  const Id = (await params).postId;

  const response = fetch(`https://www.zikoro.com/api/post/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  const blogDetail = await response;
  
  return {
    title: `${blogDetail?.data?.title || "Zikoro Event"} `,
    description: "Zikoro Blog Post",

    openGraph: {
      images: [`${blogDetail?.data?.headerImageUrl}` || ""],
    },
  };
};

export default function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
  return <FullPost postId={postId} />;
}
