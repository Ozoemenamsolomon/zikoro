import { useEffect, useState } from "react";

export function CountDown({ startDate }: { startDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  /// calculate the difference between today and event start day,
  // set the countdown

  useEffect(() => {
    const timer = setInterval(() => {
      const today = new Date();
      const eventStartDate = new Date(startDate);
      const diff = eventStartDate.getTime() - today.getTime();
      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (diff < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="w-full grid grid-cols-4 justify-center bg-[#FAFAFA] items-center py-6 px-6">
      <div className="border-r w-full flex flex-col items-center gap-y-2 justify-center">
        <p>Days</p>
        <p className="font-medium text-xl">{days}</p>
      </div>
      <div className="border-r w-full flex flex-col items-center gap-y-2 justify-center">
        <p>Hours</p>
        <p className="font-medium text-xl">{hours}</p>
      </div>
      <div className="border-r flex w-full flex-col items-center gap-y-2 justify-center">
        <p>Minutes</p>
        <p className="font-medium text-xl">{minutes}</p>
      </div>
      <div className=" flex flex-col w-full items-center gap-y-2 justify-center">
        <p>Seconds</p>
        <p className="font-medium text-xl">{seconds}</p>
      </div>
    </div>
  );
}
