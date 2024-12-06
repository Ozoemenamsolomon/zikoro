export function CustomEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-fit h-fit p-4 flex items-center flex-col justify-center gap-6">
      <p className="font-semibold gradient-text bg-basePrimary text-base sm:text-xl">
        {title}
      </p>
      <p>{description}</p>
    </div>
  );
}
