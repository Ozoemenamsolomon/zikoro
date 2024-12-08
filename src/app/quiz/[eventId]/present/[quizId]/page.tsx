import Presentation from "@/components/engagements/interactions/_components/presentation/Presentation";
import { Metadata } from "next";


export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}): Promise<Metadata> => {
  const quizId = (await params).quizId;

  const response = fetch(`https://zikoro.com/api/quiz/single/${quizId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  const quizDetail = await response;

  return {
    title: `${quizDetail?.data?.coverTitle || "Zikoro Quiz"} `,
    description: `${quizDetail?.data?.description ?? ""}`,

    openGraph: {
      images: [
     `${quizDetail?.data?.coverImage}` || ""
      ],
    },
  };
};


export default function Page({
  params: { eventId, quizId },
}: {
  params: { eventId: string; quizId: string };
}) {
  return <Presentation eventId={eventId} quizId={quizId} />;
}
