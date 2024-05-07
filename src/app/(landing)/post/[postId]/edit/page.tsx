import EditPost from "@/components/post/EditPost";

export default function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
    return <EditPost postId= {postId} />
}