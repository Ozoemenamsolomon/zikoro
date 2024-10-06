import FeaturedEventsPage from "./_components/FeaturedEventsPage";

export default function Page({
  searchParams: { query },
}: {
  searchParams: { query: string };
}) {
  return <FeaturedEventsPage query={query} />;
}
