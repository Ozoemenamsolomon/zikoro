import Link from "next/link";
import { FileCopy } from "@styled-icons/remix-fill/FileCopy";
import { Minimize2 } from "@styled-icons/feather/Minimize2";
import Image from "next/image";
import { Button } from "@/components";
import { TQuiz, TRefinedQuestion } from "@/types";
import QRCode from "react-qr-code";
import { cn } from "@/lib";
export function Advert({
  quiz,
  isRightBox,
  close,
  isLeftBox,
}: {
  quiz: TQuiz<TRefinedQuestion[]>;
  isLeftBox: boolean;
  close: () => void;
  isRightBox: boolean;
}) {
  const quizLink = `${window.location.origin}/quiz/${quiz?.eventAlias}/present/${quiz?.quizAlias}`;
  return (
    <div
      className={cn(
        "w-full flex-col bg-white rounded-l-xl h-[35rem]  items-start justify-between hidden col-span-3 md:hidden",
        isLeftBox && "flex md:flex ",
        !isRightBox && "col-span-4"
      )}
    >
      {quiz?.branding?.eventName && (
        <h2 className="font-semibold w-full border-b p-4 text-base sm:text-xl">
          Resin Art Workshop
        </h2>
      )}
      <div className="w-full p-2 flex flex-col gap-y-4 items-center justify-center ">
        <p className="text-center">Scan the QR code or use the link to join.</p>

        <div className="w-full grid grid-cols-10 text-sm items-start -2">
          <Link target="_blank" href={quizLink}>
            <FileCopy size={20} className="text-basePrimary" />
          </Link>

          <div className="flex flex-wrap whitespace-pre-wrap col-span-9 items-start  gap-2">
            {quizLink}
          </div>
        </div>
        <QRCode size={150} value={quizLink} />
      </div>

      <div className="p-4 w-full flex items-end justify-between">
        {quiz?.branding?.poweredBy && (
          <div className="space-y-1">
            <p>Powered By:</p>
            <Image
              src={"/logo.png"}
              alt="logo"
              width={300}
              height={300}
              className="w-[100px] md:w-[150px] h-[30px] md:h-[40px]"
            />
          </div>
        )}

        <Button onClick={close} className="px-0 h-fit w-fit">
          <Minimize2 size={20} />
        </Button>
      </div>
    </div>
  );
}
