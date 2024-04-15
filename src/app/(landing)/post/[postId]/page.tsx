import FullPost from "@/components/post/FullPost";

export default function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
    return <FullPost postId= {postId} />
}