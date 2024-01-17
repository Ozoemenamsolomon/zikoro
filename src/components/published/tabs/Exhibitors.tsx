import Image from "next/image";

export function Exhibitors() {
  const exhibitors = [
    "/images/ortho.png",
    "/images/cowrywise.png",
    "/images/paystack.png",
    "/svg/kiniflow.svg",
  ];
  return (
    <div className="my-6 sm:my-8 w-full p-4 sm:p-6">
      <div className="w-full grid h-full grid-cols-2 justify-center items-center py-20 px-4 sm:px-6  sm:grid-cols-4 border rounded-2xl">
        {exhibitors.map((image) => (
          <Image
            key={image}
            src={image}
            alt="exhibitors"
            width={300}
            height={150}
            className="w-[150px] h-[60px]"
          />
        ))}
      </div>
    </div>
  );
}
