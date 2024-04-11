import Image from "next/image";
export default function Page() {
  return (
    <div className="w-full h-full inset-0 fixed">
      <div className="w-fit h-fit m-auto inset-0 absolute flex flex-col gap-y-2 items-center justify-center px-4">
        <Image
          src="/mail64.png"
          alt="mail"
          className="w-20 h-20"
          width={100}
          height={100}
        />
        <h1 className="font-semibold text-xl w-full text-center sm:text-3xl">
          Verify your Email
        </h1>
        <p className="text-center w-full max-w-xl">
          Thank you for signing up! An email has been sent to your registered
          email address. Please check your inbox and follow the instructions to
          verify your account.
        </p>
      </div>
    </div>
  );
}
