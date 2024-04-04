"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Section3() {
  const router = useRouter();

  return (
    <div className="mt-12 lg:mt-16 max-w-6xl mx-auto">
      <p className=" text-2xl lg:text-4xl font-montserrat font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end px-5 lg:px-0 ">
        Why <span className="block">Choose Us?</span>
      </p>

      {/* Other Sections */}

      <div className="mt-12 lg:mt-12 px-5 lg:px-0">
        {/* 1st section */}
        <div className=" flex flex-col lg:flex-row items-center justify-center space-x-0 lg:space-x-16 mb-28 lg:mb-14">
          <div className="w-full lg:w-1/2 text-left">
            <p className=" text-xl lg:text-2xl font-bold ">
              Attendees, sponsors, and exhibitors will not just attend – they'll
              thank you for an exceptional experience.{" "}
            </p>

            <p className="pt-6  text-base font-light">
              Practical features that offer a personalised experience for
              everyone. Keep event participants updated about any last-minute
              changes to the agenda and gamify every aspect of your event.
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 rounded-lg mt-12 font-bold"
            >
              Request a Demo
            </button>
          </div>

          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <Image
              className="hidden md:block"
              src="/indexSection4a.webp"
              alt=""
              width={561.68}
              height={669}
            />
            <Image
              className="block md:hidden"
              src="/indexSection4a.webp"
              alt=""
              width={363.54}
              height={433}
            />
          </div>
        </div>

        {/* 2nd section */}
        <div className=" flex flex-col-reverse lg:flex-row items-center justify-center space-x-0 lg:space-x-16 mb-28 lg:mb-14">
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <Image
              className="hidden md:block"
              src="/indexSection4c.webp"
              alt=""
              width={561.68}
              height={669}
            />
            <Image
              className="block md:hidden"
              src="/indexSection4c.webp"
              alt=""
              width={363.54}
              height={433}
            />
          </div>
          <div className="w-full lg:w-1/2 text-left">
            <p className=" text-xl lg:text-2xl font-bold ">
              Maximize your event ROI
            </p>

            <p className="pt-6  text-base font-light">
              Significantly maximize your revenue and cut down event costs with
              Zikoro. Increase your exhibitors' and sponsors' visibility and
              engagement. With our platform, you can also access real-time
              analytics to measure the impact of their participation.
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 rounded-lg mt-12 font-bold"
            >
              See Pricing
            </button>
          </div>
        </div>

        {/* 3rd section */}
        <div className=" flex flex-col lg:flex-row items-center justify-center space-x-0 lg:space-x-16 mb-28 lg:mb-14">
          <div className="w-full lg:w-1/2 text-left">
            <p className=" text-xl lg:text-2xl font-bold ">
              Easy registration and Ticketing.{" "}
            </p>

            <p className="pt-6  text-base font-light">
              Create a personalized landing page for your events and sell
              tickets with multiple tiers. You can track your event attendees
              and ticket sales in real-time with the help of a backend system.
              In addition, you can offer discount coupons and automate every
              process, eliminating administrative hassles.
            </p>
          </div>

          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <Image
              className="hidden md:block"
              src="/indexSection4b.webp"
              alt=""
              width={561.68}
              height={669}
            />
            <Image
              className="block md:hidden"
              src="/indexSection4b.webp"
              alt=""
              width={363.54}
              height={433}
            />
          </div>
        </div>

        {/* 4th section */}
        <div className=" flex flex-col-reverse lg:flex-row items-center justify-center space-x-0 lg:space-x-16 mb-28 lg:mb-14">
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <Image
              className="hidden md:block"
              src="/indexSection4d.webp"
              alt=""
              width={561.68}
              height={669}
            />
            <Image
              className="block md:hidden"
              src="/indexSection4d.webp"
              alt=""
              width={363.54}
              height={433}
            />
          </div>
          <div className="w-full lg:w-1/2 text-left">
            <p className=" text-xl lg:text-2xl font-bold ">
              Facilitate connections that go beyond your event.{" "}
            </p>

            <p className="pt-6  text-base font-light">
              Foster meaningful connections between event speakers and attendees
              well before the event begins. Leverage our platform to initiate
              engaging conversations and gain valuable insights through
              interactive polls, social walls, photos and discussion channels.
            </p>
            <button
              onClick={() => router.push("/home")}
              className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 rounded-lg mt-12 font-bold"
            >
              Get Started for Free
            </button>
          </div>
        </div>

        {/* 5th section */}
        <div className=" flex flex-col lg:flex-row items-center justify-center space-x-0 lg:space-x-16 mb-28 lg:mb-14">
          <div className="w-full lg:w-1/2 text-left">
            <p className=" text-xl lg:text-2xl font-bold ">
              Amplify your events sales through affiliates{" "}
            </p>

            <p className="pt-6  text-base font-light">
              Empower partners to easily promote your events and earn
              commissions while you effortlessly track their performance.
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 rounded-lg mt-12 font-bold"
            >
              Learn More
            </button>
          </div>

          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <Image
              className="hidden md:block"
              src="/indexSection4e.webp"
              alt=""
              width={561.68}
              height={669}
            />
            <Image
              className="block md:hidden"
              src="/indexSection4e.webp"
              alt=""
              width={363.54}
              height={433}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
