import SuccessPage from "./_components/SuccessPage";

const page = ({
  searchParams: { eventAlias, attendeeAlias },
}: {
  searchParams: { eventAlias: string; attendeeAlias: string };
}) => {
  return <SuccessPage eventAlias={eventAlias} attendeeAlias={attendeeAlias} />;
};

export default page;
