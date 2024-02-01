import Image from "next/image";

export function BoothStaffWidget({
  image,
  name,
  profession,
  company,
}: {
  image: string;
  name: string;
  profession: string;
  company: string;
}) {
  return (
    <div className="flex  items-start justify-start gap-x-2">
      <Image
        alt="staff"
        width={120}
        height={120}
        className="w-12 h-12 rounded-full "
        src={image || "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"}
      />
      <div className="flex text-sm flex-col items-start justify-start">
        <p className="font-medium">{name || "John Doe"}</p>
        <p className="text-[#717171]">{profession || "Data Analyst"}</p>
        <p   className="text-[#717171]">{company || "Oracle"}</p>
      </div>
    </div>
  );
}
