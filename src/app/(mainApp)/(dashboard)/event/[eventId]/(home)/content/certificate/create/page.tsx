import CreateCertificate from "./_components/CreateCertificatePage";

export default function Page({
  searchParams: { certificateId },
}: {
  searchParams: { [key: string]: string };
}) {
  return <CreateCertificate certificateId={certificateId} />;
}
