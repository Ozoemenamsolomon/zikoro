import { SponsorCard } from "./_components";

export function Sponsors() {
  return (
    <div className="w-full grid grid-cols-2 mt-6 items-center gap-6 px-4">
      {[1, 2, 3, 4, 5, 6].map((_) => (
        <SponsorCard key={_} />
      ))}
    </div>
  );
}
