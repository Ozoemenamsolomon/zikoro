"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useVerifyAttendeeCertificate } from "@/hooks";
import { formatDateToHumanReadable } from "@/utils/date";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { exportComponentAsPNG } from "react-component-export-image";
import QRCode from "react-qr-code";
import { Container, SettingsPanel, Text } from "@/components/certificate";
import CertificateQRCode from "@/components/certificate/QRCode";
import { Image as ImageElement } from "@/components/certificate";
import { replaceSpecialText } from "@/utils/helpers";
import { Editor, Frame } from "@craftjs/core";
import { toast } from "@/components/ui/use-toast";
import { fabric } from "fabric";
import { useToPng, useToSvg } from "@hugocxl/react-to-image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/constants";
import { LinkedinShareButton } from "next-share";
import { useEditor } from "../../../../../../components/editor/hooks/use-editor";
import { TAttendeeCertificate } from "@/types";
import { Button } from "@/components/ui/button";

// import { ShareSocial } from "react-share-social";

const CertificateView = ({
  certificate,
}: {
  certificate: TAttendeeCertificate;
}) => {
  const initialData = certificate?.originalCertificate.JSON;

  const [isShareDropDown, showShareDropDown] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log(certificate?.originalCertificate, "initialData");

  const newState = JSON.parse(
    replaceSpecialText(JSON.stringify(initialData?.json || {}), {
      asset: certificate,
      attendee: certificate?.attendee,
      event: certificate?.originalCertificate.event,
      organization: certificate?.originalCertificate.event.organization,
    })
  );

  const { init, editor } = useEditor({
    defaultState: newState,
    defaultWidth: initialData?.width ?? 900,
    defaultHeight: initialData?.height ?? 1200,
  });

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  function toggleShareDropDown() {
    showShareDropDown((prev) => !prev);
  }

  console.log(certificate);

  const shareText = `Excited to share my ${certificate?.CertificateName} certificate from ${certificate?.originalCertificate.event.eventTitle} with you! Check it out here: ${window.location.href}`;

  return (
    <div className="flex-[60%] flex flex-col-reverse md:flex-col items-center gap-4 px-8">
      <div className="hidden md:flex gap-2 w-3/4 flex-col md:flex-row items-center justify-between">
        <Button
          onClick={() =>
            editor?.savePdf(
              {
                width: initialData?.width ?? 900,
                height: initialData?.height ?? 1200,
              },
              `${
                certificate?.attendee.firstName +
                "_" +
                certificate?.attendee.lastName
              }_${certificate?.CertificateName}.pdf`
            )
          }
          className="bg-basePrimary"
        >
          Download PDF
        </Button>
        <Button
          onClick={() => editor?.savePng()}
          className="border-basePrimary border-2 text-basePrimary bg-transparent hover:bg-basePrimary/20"
        >
          Download PNG
        </Button>
        <Button
          onClick={() => editor?.saveSvg()}
          className="border-basePrimary border-2 text-basePrimary bg-transparent hover:bg-basePrimary/20"
        >
          Download SVG
        </Button>
        <div className="relative">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleShareDropDown();
            }}
            className="border-basePrimary border-2 text-basePrimary bg-transparent hover:bg-basePrimary/20"
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
            <h3 className="font-medium ">Share this Certificate</h3>
            {isShareDropDown && (
              <ActionModal
                close={toggleShareDropDown}
                url={certificate?.certificateURL}
                shareText={shareText}
              />
            )}
          </Button>
        </div>
      </div>
      {/* mobile version dropdown shadcn*/}
      <div className="md:hidden w-full flex gap-2 justify-around items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-basePrimary w-fit px-4">Download</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem
              onClick={() =>
                editor?.savePdf(
                  `${
                    certificate?.attendee.firstName +
                    "_" +
                    certificate?.attendee.lastName
                  }_${certificate?.CertificateName}.pdf`
                )
              }
            >
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.savePng()}>
              Download PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.saveSvg()}>
              Download SVG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleShareDropDown();
            }}
            className="border-basePrimary border-2 text-basePrimary bg-transparent hover:bg-basePrimary/20"
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
            <h3 className="font-medium">Share This Certificate</h3>
            {isShareDropDown && (
              <ActionModal
                close={toggleShareDropDown}
                url={certificate?.certificateURL}
                shareText={shareText}
              />
            )}
          </Button>
        </div>
      </div>

      {/* <div
        className="relative h-[500px] md:h-[calc(100%-124px)] w-full"
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-transparent z-50" />
        <canvas ref={canvasRef} />
      </div> */}
      <div className="relative h-auto w-full">
        <img
          alt="certificate"
          src={editor?.generateLink()}
          className="h-auto"
          style={{ width: initialData?.width }}
        />{" "}
      </div>
    </div>
  );
};

const Page = ({ params }: { params: { certificateId: string } }) => {
  // function enforceDesktopView() {
  //   if (window.innerWidth < 1024) {
  //     document
  //       .querySelector("meta[name=viewport]")
  //       .setAttribute("content", "width=1024");
  //   }
  // }

  // useEffect(() => {
  //   enforceDesktopView();
  //   window.addEventListener("resize", enforceDesktopView);

  //   return () => {
  //     window.removeEventListener("resize", enforceDesktopView);
  //   };
  // }, []);

  const router = useRouter();

  const { certificateId } = params;

  const {
    attendeeCertificate: certificate,
    isLoading,
    error,
    verifyAttendeeCertificate,
  } = useVerifyAttendeeCertificate({ certificateId });

  console.log(certificate, certificateId);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!certificate) {
      toast({
        variant: "destructive",
        description: "Certificate does not exist",
      });
      return;
    }
  }, [isLoading, certificate]);

  return (
    <section className="min-h-screen flex flex-col md:flex-row justify-center gap-6 pt-20 pb-8 bg-[#F9FAFF]">
      {!isLoading && certificate ? (
        <>
          <CertificateView certificate={certificate} />
          <div className="flex-[40%] flex flex-col gap-8 px-2">
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
                    {certificate?.attendee.firstName +
                      " " +
                      certificate?.attendee.lastName}
                  </b>
                </span>
                <span className="font-medium text-gray-700">
                  Date Issued:{" "}
                  <b>
                    {certificate?.created_at &&
                      formatDateToHumanReadable(
                        new Date(certificate?.created_at)
                      )}{" "}
                  </b>
                </span>
                <span className="font-medium text-gray-700">
                  Issuing organization:{" "}
                  <b>
                    {
                      certificate?.originalCertificate?.event?.organization
                        ?.organizationName
                    }{" "}
                  </b>
                </span>
                <h1 className="text-lg md:text-xl text-gray-900 font-medium uppercase">
                  {certificate?.CertificateName}
                </h1>
              </div>
            </div>
            <div className="space-y-4 w-full md:w-3/4">
              <h2 className="text-gray-800 text-xl font-medium">
                About Zikoro
              </h2>
              <p className="text-gray-700 text-sm md:text-base">
                Zikoro credentials empowers organizations to create and
                distribute certificates and badges, enabling them to define
                their award criteria.
              </p>
            </div>
            <div className="space-y-4 w-3/4">
              <h2 className="text-gray-800 text-lg md:text-xl font-medium">
                Scope of the training
              </h2>
              <div className="flex flex-wrap gap-2">
                {certificate?.originalCertificate?.certificateSettings?.skills.map(
                  ({ value, color }) => (
                    <div
                      className="relative text-xs flex items-center gap-1.5 p-2 rounded w-fit md:text-sm"
                      style={{
                        backgroundColor: color + "22",
                        color: color,
                        borderWidth: "2px",
                        borderColor: color + "22",
                      }}
                    >
                      <span className="font-medium capitalize">{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      ) : !isLoading && !certificate ? (
        <div>this certificate does not exist</div>
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
  shareText,
}: {
  url?: string;
  instagram?: string;
  close: () => void;
  shareText: string;
}) {
  const linkToCertificate = window.location.href;
  return (
    <>
      <div className="absolute left-0 top-10 w-48 z-[1000]">
        {/* <Button className="fixed inset-0 bg-none h-full w-full z-[100]"></Button> */}
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
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  shareText
                )}`,
                "_blank"
              )
            }
            className="items-center flex px-2 h-10 w-full gap-x-2 justify-start text-xs"
          >
            <TwitterIcon />
            <span>X</span>
          </button>

          <LinkedinShareButton
            url={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(
              shareText
            )}`}
          >
            <button
              className={
                "items-center h-10 gap-x-2 px-2 flex justify-start w-full text-xs"
              }
            >
              <LinkedinIcon />
              <span>LinkedIn</span>
            </button>
          </LinkedinShareButton>
          <button
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
                  shareText
                )}`,
                "_blank"
              )
            }
            className={
              "items-center h-10 gap-x-2 px-2 flex justify-start w-full text-xs"
            }
          >
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </>
  );
}
