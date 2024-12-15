import AttendeeFillForm from "@/components/engagements/interactions/_components/interactionForm/fill/AttendeeFillForm";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ formId: string }>;
}): Promise<Metadata> => {
  const formId = (await params).formId;

  const response = fetch(`https://zikoro.com/api/engagements/form/${formId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  const formDetail = await response;

  return {
    title: `${formDetail?.data?.title || "Zikoro Quiz"} `,
    description: `${formDetail?.data?.description ?? ""}`,

    openGraph: {
      images: [`${formDetail?.data?.coverImage}` || ""],
    },
  };
};

export default function Page({
  params: { eventId, formId },
}: {
  params: { eventId: string; formId: string };
}) {
  return <AttendeeFillForm eventId={eventId} formId={formId} />;
}
