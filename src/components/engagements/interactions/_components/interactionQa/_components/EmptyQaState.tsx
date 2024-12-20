import { InlineIcon } from "@iconify/react";

export function EmptyQaState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full h-[400px] flex items-center justify-center p-6 flex-col gap-y-8">
      <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end w-[100px] h-[100px] rounded-full flex items-center justify-center">
        <InlineIcon icon="healthicons:alert" color="#001fcc" fontSize={50} />
      </div>
      <h2 className="font-semibold text-center capitalize gradient-text bg-basePrimary text-lg sm:text-2xl">
        {title}
      </h2>
      <p className="text-center">{description}</p>
    </div>
  );
}
