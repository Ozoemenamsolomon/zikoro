import { ContentSetting } from "@/components/contents/_components";

interface PageProps {
  params: {
    eventId: string;
  };
}
export default function Page({ params: { eventId } }: PageProps) {
  return (
    <ContentSetting
      eventId={eventId}
      parentClassName="relative z-1 bg-none"
      childClassName="relative mx-auto w-full max-h-full bg-none shadow-none mt-10"
    />
  );
}
