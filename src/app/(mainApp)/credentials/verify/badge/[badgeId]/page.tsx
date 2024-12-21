"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateToHumanReadable } from "@/utils/date";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { exportComponentAsPNG } from "react-component-export-image";
import QRCode from "react-qr-code";
import { Container, SettingsPanel, Text } from "@/components/certificate";
import { Image as ImageElement } from "@/components/certificate";
import { replaceSpecialText } from "@/utils/helpers";
import { Editor, Element, Frame } from "@craftjs/core";
import { toast } from "@/components/ui/use-toast";
import lz from "lzutf8";
import { useToPng } from "@hugocxl/react-to-image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/constants";
import { LinkedinShareButton } from "next-share";
import Link from "next/link";
import BadgeQRCode from "@/components/certificate/QRCode";
import { useVerifyAttendeeBadge } from "@/hooks";

// import { ShareSocial } from "react-share-social";

const style = {
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
  },
  copyContainer: {
    border: "1px solid blue",
    background: "rgb(0,0,0,0.7)",
  },
  title: {
    color: "aquamarine",
    fontStyle: "italic",
  },
};

const Page = ({ params }: { params: { badgeId: string } }) => {
  const badgeRef = useRef<HTMLDivElement | null>(null);

  const [isShareDropDown, showShareDropDown] = useState(false);

  function toggleShareDropDown() {
    showShareDropDown((prev) => !prev);
  }

  const router = useRouter();

  const { badgeId } = params;

  const {
    attendeeBadge: badge,
    isLoading,
    error,
    verifyAttendeeBadge,
  } = useVerifyAttendeeBadge({ badgeId });

  const handleDownloadPdf = async () => {
    const element = badgeRef.current;
    if (!element) return;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `${badge?.attendee.firstName + "_" + badge?.attendee.lastName}_${
        badge?.badgeName
      }.pdf`
    );
  };

  const [data, download] = useToPng<HTMLDivElement>({
    selector: "#badge",
    onSuccess: (data) => {
      if (!badge) return;
      if (typeof window !== "undefined") {
        const link = document.createElement("a");
        link.download = `${
          badge?.attendee.firstName + "_" + badge?.attendee.lastName
        }_${badge?.badgeName}.png`;
        link.href = data;
        link.click();
      }
    },
  });

  const hashRef = useRef<string | undefined>();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!badge) {
      toast({
        variant: "destructive",
        description: "Badge does not exist",
      });
      return; // Exit early after showing the toast
    }

    // if (
    //   !attendee.id ||
    //   (badge.badgeSettings.canReceive.exceptions &&
    //     badge.badgeSettings.canReceive.exceptions.includes(
    //       attendee.id
    //     ))
    // ) {
    //   btnRef.current?.click();
    //   toast({
    //     variant: "destructive",
    //     description: "Badge cannot be released for this attendee",
    //   });
    //   return; // Exit early after showing the toast
    // }

    // if (
    //   badge.badgeSettings.publishOn &&
    //   !isPast(new Date(badge.badgeSettings.publishOn))
    // ) {
    //   btnRef.current?.click();
    //   toast({
    //     variant: "destructive",
    //     description: "Badge has not been published yet",
    //   });
    //   return; // Exit early after showing the toast
    // }

    if (
      badge?.originalBadge.badgeDetails &&
      badge?.originalBadge.badgeDetails.craftHash
    ) {
      const initData = lz.decompress(
        lz.decodeBase64(badge?.originalBadge.badgeDetails.craftHash)
      );

      hashRef.current = JSON.parse(
        replaceSpecialText(JSON.stringify(initData), {
          asset: badge,
          attendee: badge?.attendee,
          event: badge?.originalBadge.event,
          organization: badge.originalBadge.event.organization,
        })
      );
    }
  }, [isLoading]);

  return (
    <section className="min-h-screen flex flex-col-reverse md:flex-row justify-center gap-6 pt-20 pb-8">
      {!isLoading ? (
        <>
          <div className="flex-1 flex flex-col-reverse md:flex-col items-center gap-4">
            <div className="flex gap-2 w-3/4">
              <Button onClick={handleDownloadPdf} className="bg-basePrimary">
                Download PDF
              </Button>
              <Button
                // onClick={() => exportComponentAsPNG(badgeRef)}
                onClick={download}
                className="border-basePrimary border-2 text-basePrimary bg-transparent"
              >
                Download PNG
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleShareDropDown();
                }}
                className="border-basePrimary border-2 text-basePrimary bg-transparent"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle fill="none" cx="17.5" cy="18.5" r="1.5" />
                  <circle fill="none" cx="5.5" cy="11.5" r="1.5" />
                  <circle fill="none" cx="17.5" cy="5.5" r="1.5" />
                  <path d="M5.5,15c0.91,0,1.733-0.358,2.357-0.93l6.26,3.577C14.048,17.922,14,18.204,14,18.5c0,1.93,1.57,3.5,3.5,3.5 s3.5-1.57,3.5-3.5S19.43,15,17.5,15c-0.91,0-1.733,0.358-2.357,0.93l-6.26-3.577c0.063-0.247,0.103-0.502,0.108-0.768l6.151-3.515 C15.767,8.642,16.59,9,17.5,9C19.43,9,21,7.43,21,5.5S19.43,2,17.5,2S14,3.57,14,5.5c0,0.296,0.048,0.578,0.117,0.853L8.433,9.602 C7.808,8.64,6.729,8,5.5,8C3.57,8,2,9.57,2,11.5S3.57,15,5.5,15z M17.5,17c0.827,0,1.5,0.673,1.5,1.5S18.327,20,17.5,20 S16,19.327,16,18.5S16.673,17,17.5,17z M17.5,4C18.327,4,19,4.673,19,5.5S18.327,7,17.5,7S16,6.327,16,5.5S16.673,4,17.5,4z M5.5,10C6.327,10,7,10.673,7,11.5S6.327,13,5.5,13S4,12.327,4,11.5S4.673,10,5.5,10z" />
                </svg>
                <h3 className="font-medium ">Share this Event</h3>
                {isShareDropDown && (
                  <ActionModal
                    close={toggleShareDropDown}
                    url={badge?.badgeURL}
                  />
                )}
              </Button>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="border-basePrimary border-2 text-basePrimary bg-transparent flex gap-2 items-center">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle fill="none" cx="17.5" cy="18.5" r="1.5" />
                      <circle fill="none" cx="5.5" cy="11.5" r="1.5" />
                      <circle fill="none" cx="17.5" cy="5.5" r="1.5" />
                      <path d="M5.5,15c0.91,0,1.733-0.358,2.357-0.93l6.26,3.577C14.048,17.922,14,18.204,14,18.5c0,1.93,1.57,3.5,3.5,3.5 s3.5-1.57,3.5-3.5S19.43,15,17.5,15c-0.91,0-1.733,0.358-2.357,0.93l-6.26-3.577c0.063-0.247,0.103-0.502,0.108-0.768l6.151-3.515 C15.767,8.642,16.59,9,17.5,9C19.43,9,21,7.43,21,5.5S19.43,2,17.5,2S14,3.57,14,5.5c0,0.296,0.048,0.578,0.117,0.853L8.433,9.602 C7.808,8.64,6.729,8,5.5,8C3.57,8,2,9.57,2,11.5S3.57,15,5.5,15z M17.5,17c0.827,0,1.5,0.673,1.5,1.5S18.327,20,17.5,20 S16,19.327,16,18.5S16.673,17,17.5,17z M17.5,4C18.327,4,19,4.673,19,5.5S18.327,7,17.5,7S16,6.327,16,5.5S16.673,4,17.5,4z M5.5,10C6.327,10,7,10.673,7,11.5S6.327,13,5.5,13S4,12.327,4,11.5S4.673,10,5.5,10z" />
                    </svg>
                    <span>Share</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ShareSocial
                    url={`http:localhost:3000/verify/${badgeId}`}
                    socialTypes={[
                      "facebook",
                      "twitter",
                      "whatsapp",
                      "linkedin",
                    ]}
                    style={style}
                  />
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
            {!isLoading ? (
              <>
                <Editor
                  enabled={false}
                  resolver={{
                    Text,
                    Container,
                    ImageElement,
                    BadgeQRCode,
                  }}
                >
                  <div className="relative px-4 w-full flex justify-center mt-6">
                    <div className="w-full h-full absolute bg-transparent z-[100]" />
                    <div
                      className="relative h-fit space-y-6 text-black bg-no-repeat"
                      style={{
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        backgroundImage: !!badge?.originalBadge?.badgeDetails
                          ?.background
                          ? `url(${badge?.originalBadge?.badgeDetails?.background})`
                          : "",
                        backgroundColor: "#fff",
                        height:
                          (badge?.originalBadge.badgeSettings.height ?? "370") +
                          "px",
                        width:
                          (badge?.originalBadge.badgeSettings.width ?? "250") +
                          "px",
                      }}
                      id="badge"
                    >
                      {hashRef.current && (
                        <Frame data={hashRef.current}>
                          <Element
                            is={Container}
                            canvas
                            className="w-full h-full"
                          >
                            <Text text={"example text"} />
                          </Element>
                        </Frame>
                      )}
                    </div>
                  </div>
                </Editor>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 1024 1024"
                    height="2.5em"
                    width="2.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-around gap-12 px-2">
            <div className="flex flex-col gap-4">
              <div>
                <svg
                  width={50}
                  height={50}
                  viewBox="0 0 37 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.293175 30.8008L5.85785 21.1909C4.71915 19.0996 4.12594 16.755 4.13301 14.3737C4.13301 10.5616 5.64738 6.90555 8.34297 4.20996C11.0386 1.51437 14.6946 0 18.5067 0C22.3189 0 25.9749 1.51437 28.6705 4.20996C31.366 6.90555 32.8804 10.5616 32.8804 14.3737C32.8875 16.755 32.2943 19.0996 31.1556 21.1909L36.7202 30.8008C36.9008 31.1135 36.9957 31.4684 36.9954 31.8295C36.995 32.1907 36.8994 32.5453 36.7182 32.8577C36.537 33.1701 36.2767 33.4292 35.9634 33.6088C35.6501 33.7885 35.2949 33.8823 34.9338 33.8809H29.0406L26.0426 38.9322C25.9416 39.0996 25.8171 39.2517 25.673 39.3839C25.2924 39.7508 24.7849 39.9568 24.2562 39.9589H23.9687C23.6587 39.9165 23.3625 39.8038 23.1027 39.6294C22.8429 39.455 22.6264 39.2236 22.4697 38.9527L18.5067 32.1355L14.5437 39.0143C14.3847 39.2813 14.1672 39.5088 13.9075 39.6795C13.6479 39.8502 13.3529 39.9598 13.0447 40H12.7572C12.2214 40.0032 11.7056 39.7969 11.3199 39.425C11.1818 39.3003 11.064 39.1548 10.9708 38.9938L7.97284 33.9425H2.07962C1.7178 33.9439 1.36201 33.8497 1.0483 33.6694C0.734589 33.4891 0.474087 33.2291 0.293175 32.9158C0.101299 32.5964 -6.86646e-05 32.2309 -6.86646e-05 31.8583C-6.86646e-05 31.4857 0.101299 31.1202 0.293175 30.8008ZM24.2767 33.9425L26.1042 30.8829C26.2842 30.5794 26.5393 30.3273 26.8451 30.1511C27.1508 29.9748 27.4968 29.8804 27.8496 29.8768H31.402L28.4656 24.7844C26.4436 26.7328 23.8952 28.0463 21.135 28.5626L24.2767 33.9425ZM18.5067 24.6406C20.5373 24.6406 22.5223 24.0385 24.2107 22.9103C25.8991 21.7822 27.215 20.1787 27.9921 18.3027C28.7692 16.4267 28.9725 14.3623 28.5764 12.3707C28.1802 10.3791 27.2024 8.54974 25.7665 7.11389C24.3307 5.67803 22.5013 4.7002 20.5097 4.30405C18.5181 3.9079 16.4538 4.11122 14.5777 4.8883C12.7017 5.66538 11.0982 6.98131 9.97007 8.6697C8.84192 10.3581 8.23978 12.3431 8.23978 14.3737C8.23978 17.0967 9.32147 19.7081 11.2469 21.6335C13.1723 23.5589 15.7838 24.6406 18.5067 24.6406ZM9.16381 29.8768C9.51667 29.8804 9.86264 29.9748 10.1684 30.1511C10.4741 30.3273 10.7292 30.5794 10.9092 30.8829L12.7367 33.9425L15.8578 28.501C13.1074 27.9741 10.5684 26.6618 8.54779 24.7228L5.61144 29.8152L9.16381 29.8768Z"
                    fill="url(#paint0_linear_461_261)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_461_261"
                      x1="36.9954"
                      y1={20}
                      x2="-6.86646e-05"
                      y2={20}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#001FCC" />
                      <stop offset={1} stopColor="#9D00FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col gap-1 md:text-lg">
                <span className="flex items-center justify-center text-lg rounded text-green-500 bg-transparent w-fit">
                  Verified
                </span>
                <span className="font-medium text-gray-700">
                  Awarded to:{" "}
                  <b className="capitalize">
                    {badge?.attendee.firstName + " " + badge?.attendee.lastName}
                  </b>
                </span>
                <span className="font-medium text-gray-700">
                  Date Issued:{" "}
                  <b>
                    {badge?.created_at &&
                      formatDateToHumanReadable(
                        new Date(badge?.created_at)
                      )}{" "}
                  </b>
                </span>
                <span className="font-medium text-gray-700">
                  Issuing organization:{" "}
                  <b>
                    {
                      badge?.originalBadge?.event?.organization
                        ?.organizationName
                    }{" "}
                  </b>
                </span>
                <h1 className="text-lg md:text-xl text-gray-900 font-medium uppercase">
                  {badge?.badgeName}
                </h1>
              </div>
            </div>
            <div className="space-y-4 w-full md:w-3/4">
              <h2 className="text-gray-800 text-xl font-medium">
                About Zikoro
              </h2>
              <p className="text-gray-700 text-sm md:text-base">
                Our platform aims to make event organization easy for event
                organizers, regardless of the event's size, while providing
                attendees with a smooth experience beyond just attending.{" "}
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                At Zikoro, we empower event organizers to create and distribute
                badges to attendees of conferences, workshops, and seminars,
                enabling them to define their award criteria.
              </p>
            </div>
          </div>
        </>
      ) : !isLoading && !badge ? (
        <div>this badge does not exist</div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
    </section>
  );
};

export default Page;

function ActionModal({
  close,
  url,
}: {
  url?: string;
  instagram?: string;
  close: () => void;
}) {
  return (
    <>
      <div className="absolute left-0 top-10  w-48">
        <Button className="fixed inset-0 bg-none h-full w-full z-[100"></Button>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex relative z-[50] flex-col py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
        >
          <button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${url}`,
                "_blank"
              )
            }
            className="items-center flex px-2  h-10 w-full gap-x-2 justify-start text-xs"
          >
            <TwitterIcon />
            <span>X</span>
          </button>

          <LinkedinShareButton url={url}>
            <button
              className={
                "items-center h-10 gap-x-2 px-2 flex justify-start w-full  text-xs"
              }
            >
              <LinkedinIcon />
              <span>LinkedIn</span>
            </button>
          </LinkedinShareButton>
          <button
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                "_blank"
              )
            }
            className={
              "items-center h-10 gap-x-2 px-2 flex justify-start w-full  text-xs"
            }
          >
            <FacebookIcon />
            <span>Facebook</span>
          </button>
          <Link
            target="_blank"
            href={""}
            className={
              "items-center hidden h-10 gap-x-2 px-2  justify-start w-full  text-xs"
            }
          >
            <InstagramIcon />
            <span>Instagram</span>
          </Link>
        </div>
      </div>
    </>
  );
}
