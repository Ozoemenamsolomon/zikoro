"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import useUserStore from "@/store/globalUserStore";
import { useGetUserReferrals } from "@/hooks";
import { format } from "date-fns";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy } from "styled-icons/boxicons-regular";
import { useGetData } from "@/hooks/services/request";

const page = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  if (!user) return;
  const { userReferrals, isLoading } = useGetUserReferrals({
    userId: user?.id,
    referredBy: user?.referralCode,
  });

  const {
    data: subscriptions,
    getData: getSubscriptions,
    isLoading: subscriptionsIsLoading,
  } = useGetData(
    `subscription/all?users=${JSON.stringify(
      userReferrals.map(({ id }) => id)
    )}`,
    false
  );

  useEffect(() => {
    getSubscriptions();
  }, [userReferrals]);

  console.log(subscriptions);

  console.log(userReferrals);

  return (
    <div>
      <h1 className="px-4 py-6 border-b text-lg font-medium">Referrals</h1>
      <div className="p-4 grid md:grid-cols-10 gap-3 md:gap-6">
        <div className="md:col-span-6 space-y-6">
          <div className="border p-2 flex items-center gap-2">
            <svg
              width={34}
              height={34}
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width={34} height={34} fill="url(#pattern0)" />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width={1}
                  height={1}
                >
                  <use
                    xlinkHref="#image0_15503_3892"
                    transform="scale(0.00195312)"
                  />
                </pattern>
                <image
                  id="image0_15503_3892"
                  width={512}
                  height={512}
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
            <div className="flex-1 flex flex-col gap-1 text-gray-500 font-medium text-xs">
              <p>Earn 20% referral commission for each friend you invite</p>
              <p>
                If your referral buys a subscription using your link, you'll
                receive 20% credit on their first paid subscription.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-4 bg-gray-100 flex gap-2 items-center rounded-md">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="2.5em"
                width="2.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy={7} r={4} />
                <line x1={20} y1={8} x2={20} y2={14} />
                <line x1={23} y1={11} x2={17} y2={11} />
              </svg>
              <div className="flex flex-col gap-1">
                <h3 className="text-greyBlack font-medium">
                  {userReferrals && userReferrals.length} Registrations
                </h3>
                <p className="text-gray-500 font-medium text-sm">
                  People who have signed up using your referral link
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 flex gap-2 items-center rounded-md">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="2.5em"
                width="2.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy={7} r={4} />
                <line x1={20} y1={8} x2={20} y2={14} />
                <line x1={23} y1={11} x2={17} y2={11} />
              </svg>
              <div className="flex flex-col gap-1">
                <h3 className="text-greyBlack font-medium">0 Subscriptions</h3>
                <p className="text-gray-500 font-medium text-sm">
                  People who have purchased a subscription using your referral
                  link
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-medium text-xl text-gray-800">
              Your referrals
            </h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userReferrals &&
                    userReferrals.map(({ firstName, lastName, created_at }) => (
                      <TableRow>
                        <TableCell className="font-medium">
                          {firstName} {lastName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {format(created_at, "PPP")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-6 w-full">
          <Button className="bg-basePrimary w-fit self-end">
            Request Payout
          </Button>
          <div className="border p-4 flex flex-col gap-2 rounded">
            <span>Referral Code</span>
            <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm relative">
              <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                Share link
              </span>
              <div className="flex gap-2 justify-between items-center overflow-hidden">
                <span className="truncate text-xs md:text-base">
                  {user?.referralCode}
                </span>
                <span className="bg-white h-full flex items-center px-2">
                  {hasCopiedText ? (
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      height="1.25em"
                      width="1.25em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.394 13.742L7.137 17.362 14.753 8.658 13.247 7.342 6.863 14.638 3.606 12.152zM21.753 8.658L20.247 7.342 13.878 14.621 13.125 14.019 11.875 15.581 14.122 17.379z" />
                    </svg>
                  ) : (
                    <button onClick={() => copyToClipboard(user?.referralCode)}>
                      <Copy className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium text-xl text-gray-800">
              Your referrals
            </h2>
            <div className="border p-4">
              <div className="flex justify-between p-2 border-b">
                <span className="font-medium">Total Credit Earned</span>
                <span>0</span>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span className="">Requested</span>
                <span>0</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="">Completed payout</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
