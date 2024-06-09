import { Link45deg } from "@styled-icons/bootstrap/Link45deg";
import { Minimize2 } from "@styled-icons/feather/Minimize2";
import Image from "next/image";
import { Button, CopyLink } from "@/components";
import { TQuiz, TRefinedQuestion } from "@/types";
import QRCode from "react-qr-code";
import { cn } from "@/lib";
import Link from "next/link";
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
  const quizLink = `${window.location.origin}/quiz/${quiz?.eventAlias}/present`;
  return (
    <div
      className={cn(
        "w-full flex-col  rounded-l-xl h-[90vh]  items-start justify-between hidden col-span-3 md:hidden",
        isLeftBox && "flex md:flex ",
        !isRightBox && "col-span-4"
      )}
    >
      {quiz?.branding?.eventName ? (
        <h2 className="font-semibold w-full border-b p-4 text-base sm:text-xl">
          Resin Art Workshop
        </h2>
      ) : (
        <div className="w-1 h-1"></div>
      )}
      <div className="w-full p-2 flex flex-col gap-y-3 items-center justify-center ">
        <div className="w-fit h-fit  bg-white p-2">
          <QRCode size={150} value={quizLink} />
        </div>

        <div className="w-full flex items-center">
          <Button className="bg-white w-[10%] px-0 rounded-r-none rounded-l-lg border-y-0 border-l border-r-0 h-11">
            <Link45deg size={22} />
          </Button>
          <input
            value={quizLink}
            type="text"
            className="w-[70%] text-mobile h-11 border bg-white pl-4"
          />
          <Button className="w-[20%] rounded-r-lg rounded-l-none bg-basePrimary text-white text-mobile">
           <span className="text-white"> Copy</span>
          </Button>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-y-3">
          <p>Or join at</p>
          <div className="gap-2 grid grid-cols-10">
            <p className="w-full col-span-9 text-ellipsis whitespace-nowrap overflow-hidden text-xl">
              {quizLink}
            </p>
            <CopyLink link={quizLink} />
          </div>
          <p className="font-semibold text-lg sm:text-3xl">{quiz?.quizAlias}</p>
        </div>
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
