"use client";

import { Minimize2 } from "styled-icons/feather";
import { Button } from "@/components";
import { cn } from "@/lib";
import React, {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { TAnswer, TQuestion, TQuiz } from "@/types";
import { QUser } from "@/constants";
import Avatar from "react-nice-avatar";
import { AvatarFullConfig } from "react-nice-avatar";
import { ArrowUpwardOutline } from "styled-icons/evaicons-outline";
import { FeedStar } from "styled-icons/octicons";
import { Plus } from "styled-icons/bootstrap";
import { Reorder } from "framer-motion";

type TLeaderBoard = {
  quizParticipantId: string;
  attendeeName: string;
  image: Required<AvatarFullConfig>;
  totalScore: number;
  recentScore: number;
};

interface TParticipantScores {
  quizParticipantId: string;
  attendeeName: string;
  image: Required<AvatarFullConfig>;
  totalScore: number;
  recentScore: number;
  recentAt: Date;
}

function ScoreCounter({
  num,
  attendee,
  score,
  recentAnime,
  setRecentAnime,
  isLeaderBoardVisible,
}: {
  recentAnime: boolean;
  setRecentAnime: React.Dispatch<React.SetStateAction<boolean>>;
  isLeaderBoardVisible: boolean;
  score: number;
  attendee: TLeaderBoard;
  num: number;
}) {
  const pTag = useRef<HTMLParagraphElement | null>(null);
  const secondPTag = useRef<HTMLParagraphElement | null>(null);

  //  console.log(isLeaderBoardVisible, recentAnime);

  // This effect runs whenever isLeaderBoardVisible changes
  useEffect(() => {
    if (isLeaderBoardVisible) {
      // Start first animation when leaderboard is visible
      firstElement();
    }
  }, [isLeaderBoardVisible, recentAnime]);

  const firstElement = useCallback(() => {
    if (pTag.current && isLeaderBoardVisible) {
      let startTimestamp: any = null;
      const step = (timestamp: any) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
        if (pTag.current) {
          pTag.current.innerHTML = `${Math.floor(progress * num)}`;
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
        if (num === Math.floor(progress * num) && progress === 1) {
          setRecentAnime(true);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [num, isLeaderBoardVisible]);

  const secondElement = useCallback(() => {
    if (secondPTag.current && recentAnime && isLeaderBoardVisible) {
      let startTimestamp: any = null;
      const step = (timestamp: any) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
        if (secondPTag.current) {
          const actual = score - num;
          secondPTag.current.innerHTML = `${Math.floor(
            progress * num + actual
          )}`;
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [num, score, recentAnime, isLeaderBoardVisible]);

  // This effect runs whenever recentAnime changes
  useEffect(() => {
    if (recentAnime) {
      secondElement();
    }
  }, [recentAnime, secondElement]);

  return (
    <>
      <div
        className={cn(
          "flex w-fit bg-gradient-to-r from-green-600  to-gray-700 rounded-3xl  px-2 py-1 items-center gap-x-1 text-tiny invisible",
          attendee?.recentScore > 0 && "visible",
          !recentAnime && " recent-anime ",
          recentAnime && "invisible recent-score-opacity-transition"
        )}
      >
        <Plus size={18} color="#ffffff" className="text-white" />
        <p className="font-medium text-white">
          {/*attendee?.recentScore?.toFixed(0)*/}

          <p ref={pTag}>{(num ?? 0)?.toFixed(0)}</p>
        </p>
      </div>

      <div className="flex items-center gap-x-1">
        <p ref={secondPTag}>{score}</p>
        <FeedStar size={15} className="text-amber-600" />
      </div>
    </>
  );
}

function OtherPlayers({
  attendee,
  index,
  isLeaderBoardVisible,
  recentAnime,
  setRecentAnime,
}: {
  attendee: TLeaderBoard;
  recentAnime: boolean;
  setRecentAnime: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  isLeaderBoardVisible: boolean;
}) {
  {

  }
  return (
    <div
      className={cn(
        "grid grid-cols-4 items-center tranform transition-all duration-1000 ease-in-out gap-2 px-3 py-3",
        index % 2 !== 0 && "border-y "
      )}
    >
      <div className="flex items-center col-span-2 w-full gap-x-2">
        <p className="text-sm">{`${index + 4}th`}</p>

        <Avatar
          shape="circle"
          className="w-[2.5rem] h-[2.5rem]"
          {...attendee?.image}
        />
        <p className="text-sm">{attendee?.attendeeName ?? ""}</p>
      </div>
      <ScoreCounter
        recentAnime={recentAnime}
        setRecentAnime={setRecentAnime}
        num={Number(attendee?.recentScore?.toFixed(0))}
        attendee={attendee}
        score={attendee?.totalScore}
        isLeaderBoardVisible={isLeaderBoardVisible}
      />
  
    </div>
  );
}

export function LeaderBoard({
  isRightBox,
  isLeftBox,
  close,
  answers,
  quiz,
}: {
  isLeftBox: boolean;
  isRightBox: boolean;
  close: () => void;
  answers: TAnswer[];
  quiz: TQuiz<TQuestion[]>;
}) {
  //console.log(answers);
  const [recentAnime, setRecentAnime] = useState(false);
  const [board, setBoard] = useState<TLeaderBoard[]>([]);
  const observeEl = useRef<IntersectionObserver>();
  const [isLeaderBoardVisible, setIsLeaderBoardVisible] = useState(false);
  const restructuredScores = useMemo(() => {
    const participantGroup: { [key: string]: TParticipantScores } = {};
    if (Array.isArray(answers) && answers.length > 0) {
      const filteredAnswers = answers?.filter((item) => {
        const quizStart = new Date(quiz?.liveMode?.startingAt).getTime();
        const answerCreated = new Date(item?.created_at).getTime();
        const isQuizLive = quiz?.accessibility?.live;
        if (isQuizLive) {
          return answerCreated > quizStart;
        } else {
          return true;
        }
      });
      filteredAnswers?.forEach((ans) => {
        const key = ans?.quizParticipantId;
        const createdAt = new Date(ans?.created_at);
        if (!participantGroup[key]) {
          participantGroup[key] = {
            quizParticipantId: ans?.quizParticipantId,
            attendeeName: ans?.attendeeName,
            image: ans?.avatar,
            recentAt: createdAt,
            recentScore: Number(ans?.attendeePoints),
            totalScore: 0,
          };
        }
        participantGroup[key].totalScore += Number(ans?.attendeePoints);

        if (createdAt > participantGroup[key].recentAt) {
          participantGroup[key].recentScore = Number(ans?.attendeePoints);
          participantGroup[key].recentAt = createdAt;
        }
      });

      const result: TLeaderBoard[] = Object.entries(participantGroup).map(
        ([quizParticipantId, data]) => ({
          quizParticipantId: data?.quizParticipantId,
          attendeeName: data?.attendeeName,
          image: data?.image,
          recentScore: Number(data?.recentScore),
          totalScore: data?.totalScore,
        })
      );

      return result;
    } else {
      return [];
    }
  }, [answers, quiz]);

  function onToggleBoardVisibility() {
    close();
    setRecentAnime(false);
    setIsLeaderBoardVisible(false);
  }
  /**
   const totalMaxPoints = useMemo(() => {
    const totalPoints = quiz?.questions?.reduce((acc, cur) => {
      return acc + Number(cur?.points);
    }, 0);
    return totalPoints;
  }, [quiz]);
 */

  useEffect(() => {
    const update = () => {
      if (recentAnime && restructuredScores) {
        const data = restructuredScores.sort((a, b) => {
          const aScore = a?.totalScore;
          const bScore = b?.totalScore;
          return bScore - aScore;
        });

        setBoard(data);
      } else if (restructuredScores) {
        const reformedData = restructuredScores.map((value) => {
          return {
            ...value,
            totalScore: value?.totalScore - value?.recentScore,
          };
        });
        const data = reformedData.sort((a, b) => {
          const aScore = a?.totalScore;
          const bScore = b?.totalScore;
          return bScore - aScore;
        });

        setBoard(data);
      }
    }
    update()
  }, [restructuredScores, recentAnime])



  // observe leader board

  const observingLeaderBoard = useCallback((node: any) => {
    if (observeEl.current) observeEl.current.disconnect();
    observeEl.current = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        setRecentAnime(false);
        setIsLeaderBoardVisible(false);
        //
      } else {
        setIsLeaderBoardVisible(true);
      }
    });

    if (node) observeEl.current.observe(node);
  }, []);

  return (
    <div
      ref={observingLeaderBoard}
      className={cn(
        "w-full col-span-3 bg-white h-[90vh] border-r border-y rounded-r-xl hidden  md:hidden",
        isRightBox && "block md:block ",
        !isLeftBox && "col-span-4"
      )}
    >
      <div className="w-full h-[41vh] gap-y-2 flex bg-[#001fcc]/20 pb-2 flex-col rounded-tr-xl items-center ">
        <div className="flex items-center p-4 justify-between w-full">
          <h2 className="font-semibold  text-base sm:text-xl">LeaderBoard</h2>
          <div className="flex items-center gap-x-2">
            <div className="text-xs flex text-white bg-basePrimary rounded-3xl px-2 py-1 justify-center items-center gap-x-1">
              <QUser color="#ffffff" />
              <p>{board?.length || 0}</p>
            </div>
            <Button
              onClick={onToggleBoardVisibility}
              className="px-0 h-fit w-fit"
            >
              <Minimize2 size={20} />
            </Button>
          </div>
        </div>

        {Array.isArray(board) && board?.length > 0 && (
          <div className="flex items-end justify-center">
            <div
              className={cn(
                "flex items-center  flex-col gap-y-1 justify-center invisible",
                board[1]?.attendeeName && "flex visible"
              )}
            >
              {/**2nd */}
              <div className="quiz-player-animation gap-y-1 flex flex-col items-center justify-center">
                <p className="font-semibold text-lg mb-1">2nd</p>
                {/*    <Image
                className="w-[4.0rem] h-[4.0rem]"
                src="/quizattendee.png"
                width={100}
                height={100}
                alt="quizplayer"
              />*/}
                <Avatar
                  shape="circle"
                  className="w-[4.0rem]  h-[4.0rem]"
                  {...board[1]?.image}
                />
              </div>

              <p className="font-medium">{board[1]?.attendeeName ?? ""}</p>

              <div className="w-fit flex items-center gap-x-1">
                <p className="font-medium text-gray-600">
                  {(board[1]?.totalScore ?? 0)?.toFixed(0)}
                </p>
                <FeedStar size={14} className="text-amber-600" />
              </div>
            </div>
            {/**1st */}
            <div
              className={cn(
                "flex items-center  flex-col gap-y-1 justify-center invisible",
                board[0]?.attendeeName && "flex visible"
              )}
            >
              <div className="quiz-player-animation gap-y-1 flex flex-col items-center justify-center">
                <p className="font-semibold text-xl mb-1">1st</p>
                {/*   <Image
                className="w-[5.5rem] h-[5.5rem]"
                src="/quizattendee.png"
                width={100}
                height={100}
                alt="quizplayer"
              />*/}
                <Avatar
                  shape="circle"
                  className="w-[5.5rem] h-[5.5rem]"
                  {...board[0]?.image}
                />
              </div>
              <p className="font-medium">{board[0]?.attendeeName ?? ""}</p>
              <div className="w-fit flex items-center gap-x-1">
                <p className="font-medium text-gray-600">
                  {(board[0]?.totalScore ?? 0)?.toFixed(0)}
                </p>
                <FeedStar size={14} className="text-amber-600" />
              </div>
            </div>
            {/**3rd */}
            <div
              className={cn(
                "flex items-center  flex-col gap-y-1 justify-center invisible",
                board[2]?.attendeeName && " visible"
              )}
            >
              <div className="quiz-player-animation gap-y-1 flex flex-col items-center justify-center">
                <p className="font-semibold text-base mb-1">3rd</p>
                {/*  <Image
                className="w-[3.5rem] h-[3.5rem]"
                src="/quizattendee.png"
                width={100}
                height={100}
                alt="quizplayer"
              />*/}
                <Avatar
                  shape="circle"
                  className="w-[3.5rem] h-[3.5rem]"
                  {...board[2]?.image}
                />
              </div>
              <p className="font-medium">{board[2]?.attendeeName ?? ""}</p>
              <div className="w-fit flex items-center gap-x-1">
                <p className="font-medium text-gray-600">
                  {(board[2]?.totalScore ?? 0)?.toFixed(0)}
                </p>
                <FeedStar size={14} className="text-amber-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-y-auto no-scrollbar h-[49vh] space-y-2">
        <Reorder.Group values={board} onReorder={setBoard}>
          {Array.isArray(board) &&
            board.slice(3, board?.length)?.map((attendee, index) => (
              <Reorder.Item
                as="div"
                key={attendee?.quizParticipantId}
                value={attendee?.totalScore}
              >
                <OtherPlayers
                  key={attendee?.quizParticipantId}
                  attendee={attendee}
                  index={index}
                  recentAnime={recentAnime}
                  setRecentAnime={setRecentAnime}
                  isLeaderBoardVisible={isLeaderBoardVisible}
                />
              </Reorder.Item>
            ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
