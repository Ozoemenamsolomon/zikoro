export function RouteHeader({
  header,
  description,
}: {
  header: string;
  description?: string;
}) {
  return (
    <header className="px-4 w-full flex mb-2 flex-col sm:mb-4 items-start justify-start gap-y-1">
      <h1 className="text-basePrimary font-semibold text-base sm:text-2xl">
        {header}
      </h1>
      <p className="sm:text-sm">{description}</p>
    </header>
  );
}
