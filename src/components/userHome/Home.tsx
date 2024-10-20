"use client";

import { Suspense } from "react";
import useUserStore from "@/store/globalUserStore";
import { ActionCard, UserCertificates, UserEvents } from "./_components";


export default function Home() {
  const { user } = useUserStore();

  const homeTab = [
    {
      title: "Create your Event",
      subTitle: "It is easy to get started",
      image: "/images/event.svg",
      href: "/events",
    },
    {
      title: "Refer & Earn",
      subTitle: "Invite a friend to use zikoro and get paid",
      image: "/images/referral.svg",
      href: "/referrals",
    },
    {
      title: "Profile",
      subTitle: "View profile",
      image: "/images/profile.svg",
      href: "/profile",
    },
    {
      title: "Contact",
      subTitle: "View the contact you have created so far",
      image: "/images/contact.svg",
      href: "",
    },
    {
      title: "Explore",
    subTitle: "View interesting upcoming events",
      image: "/images/explore.svg",
      href: "/explore",
    },
  ];
  return (
    <>
      <div className=" px-2 sm:px-4 pb-2 w-full pt-[6.5rem] fixed top-0 bg-white   flex justify-between items-center ">
        <h2 className="font-semibold text-base sm:text-2xl capitalize">{`Welcome ${
          user?.firstName ?? "User"
        }`}</h2>
      </div>
      <div className="w-full px-2 sm:px-4 pt-[7.5rem] ">
        <div className="w-full py-4 overflow-x-auto no-scrollbar">
          <div className="min-w-max gap-4 flex items-center">
            {homeTab.map(({ title, href, subTitle, image }) => (
              <ActionCard
                key={title}
                title={title}
                href={href}
                subTitle={subTitle}
                image={image}
              />
            ))}
          </div>
        </div>
        <div className="pb-20 w-full mt-3 h-full grid grid-cols-1 xl:grid-cols-8 gap-5 items-start">
          <UserEvents />
          <UserCertificates />
        </div>
      </div>
    </>
  );
}

// export default function Home() {
//   return (
//     <Suspense>
//       <HomeComp />
//     </Suspense>
//   );
// }