"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVerifyAttendeeCertificate } from "@/hooks/services/certificate";
import { TFullCertificate } from "@/types/certificates";
import { formatDateToHumanReadable } from "@/utils/date";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import QRCode from "react-qr-code";
import { ShareSocial } from "react-share-social";

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

const Page = ({ params }: { params: { certificateId: string } }) => {
  const [certificate, setCertificate] = useState<TFullCertificate | null>(null);

  const certificateRef = useRef();

  const { certificateId } = params;

  const { verifyAttendeeCertificate, isLoading, error } =
    useVerifyAttendeeCertificate();

  const router = useRouter();

  const verify = async () => {
    const verifiedCertificate = await verifyAttendeeCertificate(certificateId);

    console.log(verifiedCertificate);

    if (!!verifiedCertificate) {
      setCertificate(verifiedCertificate);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  const handleDownloadPdf = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `${
        certificate?.attendee.firstName + "_" + certificate?.attendee.lastName
      }_${certificate?.CertificateName}.pdf`
    );
  };

  return (
    <section className="min-h-screen flex justify-center gap-6 pt-20 pb-8">
      {!isLoading ? (
        <>
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="flex gap-2 w-3/4">
              <Button onClick={handleDownloadPdf} className="bg-basePrimary">
                Download PDF
              </Button>
              <Button
                onClick={() => exportComponentAsPNG(certificateRef)}
                className="border-basePrimary border-2 text-basePrimary bg-transparent"
              >
                Download PNG
              </Button>
              <DropdownMenu>
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
                    url={`http:localhost:3000/verify/${certificateId}`}
                    socialTypes={[
                      "facebook",
                      "twitter",
                      "whatsapp",
                      "linkedin",
                    ]}
                    style={style}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div
              className="bg-white w-3/4 space-y-6 text-black"
              ref={certificateRef}
            >
              <div className="h-6 w-full relative">
                <Image
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  src={"/images/certificate_design.png"}
                  alt={"design"}
                />
              </div>
              <div className="px-6">
                <div className="flex justify-between mb-16">
                  <img
                    className="w-[50px] h-[50px]"
                    src={"/images/your_logo.png"}
                    alt={"zikoro logo"}
                  />
                  <img
                    className="w-[50px] h-[50px]"
                    src={"/images/zikoro_logo.png"}
                    alt={"zikoro logo"}
                  />
                </div>
                <div className="mb-12 space-y-4 text-center w-full">
                  <h1 className="text-2xl uppercase">training certificate</h1>
                  <p className="text-lg">This is to certify that</p>
                </div>
                <div className="pb-1 mx-auto w-2/3 text-center mb-6">
                  <span className="text-4xl font-DancingScript">
                    {certificate?.attendee.firstName +
                      " " +
                      certificate?.attendee.lastName}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-sm text-center w-full">
                  <p>
                    Successfully completed the{" "}
                    {certificate?.certificate.TrainingDuration}-hour{" "}
                    {certificate?.CertificateName}, earning{" "}
                    {certificate?.certificate.cpdPoints} credits.{" "}
                  </p>
                  <p>
                    A program offered by{" "}
                    {
                      certificate?.certificate?.event?.organization
                        ?.organizationName
                    }
                    , in collaboration with Zikoro
                  </p>
                </div>
                <p className="text-xs text-center w-full mb-6">
                  {formatDateToHumanReadable(new Date(certificate?.created_at))}
                  , LAGOS, NIGERIA
                </p>
                <div className="flex flex-col items-center gap-2">
                  <div
                    style={{
                      height: "auto",
                      margin: "0 auto",
                      maxWidth: 64,
                      width: "100%",
                    }}
                  >
                    <QRCode
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={`www.zikoro.com/verify/${certificate?.certificateId}`}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                  <h2 className="text-tiny">
                    Certificate ID {certificate?.certificateId}
                  </h2>
                  <a
                    href="www.zikoro.com/verify"
                    className="flex gap-1 items-center text-tiny text-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={15}
                      height={15}
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_11548_17274)">
                        <path
                          d="M11.7956 8.80994C11.7937 8.21232 11.7297 7.61652 11.6044 7.03216H13.2044C13.122 6.78841 13.0225 6.55078 12.9067 6.32105H11.4178C11.1379 5.38596 10.7038 4.5042 10.1333 3.71216C9.76888 3.55892 9.38888 3.44566 9 3.37438C9.78149 4.21405 10.3714 5.21335 10.7289 6.30327L8.33334 6.30327V3.29883H7.66667L7.66667 6.30772L5.27112 6.30772C5.62937 5.21583 6.22082 4.21492 7.00445 3.37438C6.61724 3.44447 6.23874 3.55623 5.87556 3.70772C5.30287 4.49644 4.86576 5.37516 4.58223 6.30772H3.08445C2.96648 6.54164 2.86548 6.78375 2.78223 7.03216H4.39556C4.27035 7.61652 4.20631 8.21232 4.20445 8.80994C4.20568 9.46362 4.28022 10.1151 4.42667 10.7522H2.85334C2.94528 11.0013 3.0552 11.2434 3.18223 11.4766H4.61778C4.88988 12.3281 5.29325 13.1318 5.81334 13.8588C6.18577 14.0186 6.57483 14.1363 6.97334 14.2099C6.24797 13.4187 5.69012 12.489 5.33334 11.4766H7.67111L7.67111 14.2944L8.33778 14.2944L8.33778 11.4766H10.6667C10.3087 12.4894 9.74929 13.4192 9.02223 14.2099C9.4226 14.1338 9.81318 14.013 10.1867 13.8499C10.7059 13.1257 11.1093 12.325 11.3822 11.4766H12.8044C12.9309 11.2477 13.0408 11.0101 13.1333 10.7655H11.5556C11.709 10.1248 11.7895 9.46875 11.7956 8.80994ZM7.66667 10.7522H5.11556C4.80266 9.52898 4.78894 8.24843 5.07556 7.01883L7.66667 7.01883V10.7522ZM10.8844 10.7522H8.33334V7.03216L10.9244 7.03216C11.0521 7.61604 11.1147 8.21227 11.1111 8.80994C11.1147 9.46415 11.0386 10.1164 10.8844 10.7522Z"
                          fill="black"
                        />
                        <path
                          d="M8.00003 1.69824C6.59359 1.69824 5.21872 2.1153 4.04931 2.89668C2.87989 3.67806 1.96844 4.78866 1.43022 6.08805C0.891997 7.38743 0.751173 8.81724 1.02556 10.1967C1.29994 11.5761 1.97721 12.8432 2.97172 13.8377C3.96622 14.8322 5.2333 15.5094 6.61272 15.7838C7.99214 16.0582 9.42195 15.9174 10.7213 15.3792C12.0207 14.8409 13.1313 13.9295 13.9127 12.7601C14.6941 11.5907 15.1111 10.2158 15.1111 8.80935C15.1111 6.92337 14.3619 5.11463 13.0283 3.78104C11.6948 2.44745 9.88601 1.69824 8.00003 1.69824ZM8.00003 15.0316C6.76939 15.0316 5.56639 14.6666 4.54315 13.9829C3.51991 13.2992 2.72239 12.3275 2.25145 11.1905C1.7805 10.0535 1.65728 8.80245 1.89737 7.59546C2.13745 6.38847 2.73006 5.27977 3.60025 4.40958C4.47045 3.53938 5.57914 2.94678 6.78614 2.70669C7.99313 2.4666 9.24421 2.58982 10.3812 3.06077C11.5181 3.53171 12.4899 4.32923 13.1736 5.35247C13.8573 6.37571 14.2223 7.57871 14.2223 8.80935C14.2223 10.4596 13.5667 12.0422 12.3998 13.2091C11.2329 14.376 9.65027 15.0316 8.00003 15.0316Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_11548_17274">
                          <rect
                            width={16}
                            height={16}
                            fill="white"
                            transform="translate(0 0.80957)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>www.zikoro.com/verify</span>
                  </a>
                </div>
              </div>

              <div className="h-6 relative">
                <Image
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  src={"/images/certificate_design.png"}
                  alt={"design"}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-around gap-12 px-2">
            <div className="flex gap-4 w-3/4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={48}
                  height={62}
                  viewBox="0 0 48 62"
                  fill="none"
                >
                  <path
                    d="M18.0585 50.4724C16.3605 49.9892 14.8494 49.0016 13.7252 47.6404C13.5233 47.4308 13.2383 47.1352 13.0719 46.9906C12.8544 46.945 12.4429 46.9008 12.1565 46.8696C10.4168 46.8101 8.73606 46.2243 7.33626 45.1896C6.59683 44.5767 5.99208 43.8176 5.55999 42.96L0.360659 51.9672C0.109282 52.4021 -0.0140728 52.8992 0.00481487 53.4012C0.0237025 53.9032 0.184063 54.3897 0.467413 54.8045C0.750763 55.2193 1.14557 55.5456 1.60632 55.7458C2.06707 55.946 2.57501 56.0119 3.07159 55.936L7.71346 55.2302L9.42439 59.6065C9.60545 60.0752 9.91624 60.4828 10.3204 60.7813C10.7246 61.0799 11.2054 61.2573 11.7067 61.2926C11.7756 61.2979 11.8447 61.3005 11.9137 61.3005C12.3812 61.3016 12.8407 61.1788 13.2453 60.9446C13.6499 60.7104 13.9852 60.3731 14.2171 59.9672L19.6109 50.6238C19.5709 50.6245 19.5337 50.6325 19.4931 50.6325C19.0104 50.6334 18.5291 50.5796 18.0585 50.4724Z"
                    fill="black"
                  />
                  <path
                    d="M42.4389 42.959C42.0073 43.8174 41.403 44.5773 40.6639 45.1912C39.2639 46.2256 37.5833 46.8114 35.8437 46.8713C35.5546 46.9025 35.1418 46.9467 34.9257 46.9923C34.759 47.1368 34.4712 47.435 34.2723 47.6434C33.1505 49.0006 31.6438 49.9861 29.9507 50.4701C29.4754 50.5795 28.9891 50.6345 28.5012 50.6339C28.4627 50.6339 28.4278 50.6263 28.3896 50.6257L33.7825 59.9673C34.0143 60.3732 34.3496 60.7105 34.7542 60.9447C35.1588 61.1789 35.6183 61.3017 36.0858 61.3006C36.1548 61.3006 36.2238 61.298 36.2928 61.2927C36.7945 61.2573 37.2756 61.0797 37.68 60.7809C38.0845 60.4821 38.3955 60.0743 38.5767 59.6053L40.2863 55.2303L44.9263 55.9361C45.423 56.0124 45.9312 55.9468 46.3923 55.7468C46.8533 55.5468 47.2484 55.2205 47.532 54.8056C47.8156 54.3907 47.9762 53.9041 47.9952 53.4019C48.0141 52.8997 47.8907 52.4024 47.6392 51.9672L42.4389 42.959Z"
                    fill="black"
                  />
                  <path
                    d="M24.0001 10.6338C21.363 10.6338 18.7851 11.4158 16.5925 12.8809C14.3998 14.3459 12.6909 16.4283 11.6817 18.8647C10.6725 21.301 10.4085 23.9819 10.923 26.5683C11.4374 29.1547 12.7073 31.5305 14.572 33.3952C16.4367 35.2599 18.8125 36.5298 21.3989 37.0443C23.9853 37.5587 26.6662 37.2947 29.1025 36.2855C31.5389 35.2764 33.6213 33.5674 35.0863 31.3747C36.5514 29.1821 37.3334 26.6042 37.3334 23.9671C37.3293 20.4322 35.9232 17.0432 33.4236 14.5436C30.924 12.044 27.535 10.638 24.0001 10.6338ZM30.4428 20.7067L25.1094 28.7067C25 28.8707 24.8555 29.0084 24.6864 29.1099C24.5173 29.2113 24.3278 29.274 24.1316 29.2934C24.0873 29.2978 24.043 29.3005 24.0001 29.3005C23.6465 29.3004 23.3074 29.1599 23.0574 28.9098L19.0574 24.9098C18.8145 24.6583 18.6802 24.3215 18.6832 23.9719C18.6862 23.6223 18.8265 23.2879 19.0737 23.0407C19.3209 22.7935 19.6553 22.6533 20.0049 22.6502C20.3545 22.6472 20.6913 22.7816 20.9428 23.0245L23.793 25.8747L28.224 19.2275C28.4202 18.9336 28.7252 18.7297 29.0718 18.6605C29.4184 18.5913 29.7783 18.6626 30.0723 18.8587C30.3664 19.0547 30.5706 19.3595 30.6401 19.706C30.7095 20.0526 30.6386 20.4125 30.4428 20.7067Z"
                    fill="black"
                  />
                  <path
                    d="M29.3467 47.8725C30.5303 47.4898 31.5749 46.767 32.3503 45.7943C32.7479 45.3244 33.2151 44.9182 33.7357 44.5899C34.3186 44.3724 34.932 44.2476 35.5535 44.2201C36.7772 44.2004 37.968 43.82 38.9767 43.1268C39.8638 42.2661 40.4864 41.1696 40.7709 39.9668C40.9346 39.3525 41.1901 38.7665 41.5288 38.2285C41.9589 37.7797 42.4556 37.3998 43.0015 37.1023C44.1024 36.5407 45.0162 35.6712 45.6317 34.5996C46.061 33.448 46.1558 32.1986 45.9052 30.9955C45.7903 30.3555 45.7732 29.7018 45.8544 29.0567C46.0481 28.4695 46.3295 27.9151 46.6891 27.4121C47.4461 26.4128 47.9011 25.2174 48 23.9676C47.9005 22.7186 47.446 21.5241 46.6901 20.5249C46.3299 20.0217 46.048 19.4668 45.8541 18.8791C45.7729 18.2344 45.79 17.5811 45.9049 16.9416C46.1553 15.7385 46.061 14.4893 45.6328 13.3375C45.017 12.2668 44.1038 11.3979 43.0039 10.8361C42.4574 10.5378 41.9603 10.157 41.5299 9.70719C41.1909 9.1692 40.935 8.58319 40.7708 7.96892C40.487 6.76639 39.8649 5.67026 38.9779 4.81012C37.9692 4.11685 36.7784 3.73654 35.5547 3.71679C34.9332 3.6893 34.3198 3.56454 33.7369 3.34705C33.2169 3.0179 32.7498 2.61182 32.3515 2.14265C31.5759 1.16882 30.5309 0.444821 29.3467 0.060919C28.1485 -0.108594 26.9269 0.0775059 25.8336 0.596119C25.2514 0.851694 24.6326 1.01438 24 1.07825C23.3679 1.01461 22.7497 0.852054 22.168 0.596519C21.0745 0.0770589 19.8521 -0.108454 18.6537 0.0631856C17.4701 0.445684 16.4253 1.16833 15.6497 2.14092C15.2521 2.6108 14.7849 3.01698 14.2643 3.34532C13.6814 3.56281 13.068 3.68756 12.4465 3.71505C11.2228 3.73481 10.032 4.11512 9.02333 4.80839C8.13619 5.6691 7.51364 6.76552 7.22907 7.96839C7.06544 8.58267 6.80993 9.16871 6.4712 9.70665C6.04108 10.1555 5.54436 10.5354 4.99853 10.8329C3.89764 11.3944 2.98379 12.264 2.36827 13.3356C1.93902 14.4871 1.84422 15.7366 2.0948 16.9397C2.2097 17.5797 2.22682 18.2334 2.1456 18.8785C1.95191 19.4657 1.6705 20.0201 1.31093 20.5231C0.553856 21.5224 0.0989312 22.7177 0 23.9676C0.0994897 25.2165 0.553969 26.411 1.30987 27.4103C1.6701 27.9135 1.95197 28.4684 2.14587 29.0561C2.22716 29.701 2.21003 30.3545 2.09507 30.9943C1.84468 32.1973 1.93901 33.4466 2.3672 34.5984C2.98299 35.669 3.89623 36.5379 4.99613 37.0997C5.54257 37.398 6.03975 37.7788 6.47013 38.2287C6.80906 38.7666 7.06496 39.3526 7.2292 39.9669C7.51297 41.1694 8.13513 42.2656 9.02213 43.1257C10.0308 43.819 11.2216 44.1993 12.4453 44.2191C13.0668 44.2465 13.6802 44.3713 14.2631 44.5888C14.7831 44.9179 15.2502 45.324 15.6485 45.7932C16.4242 46.7668 17.4692 47.4905 18.6533 47.8743C19.8515 48.0432 21.0729 47.8572 22.1664 47.3391C22.7486 47.0835 23.3674 46.9208 24 46.8569C24.6321 46.9206 25.2503 47.0831 25.832 47.3387C26.6781 47.7028 27.5816 47.9157 28.5013 47.9676C28.7858 47.9685 29.0695 47.9366 29.3467 47.8725ZM24 39.9676C20.8355 39.9676 17.7421 39.0292 15.1109 37.2711C12.4797 35.513 10.4289 33.0141 9.21793 30.0905C8.00693 27.1669 7.69007 23.9498 8.30744 20.8461C8.9248 17.7424 10.4487 14.8915 12.6863 12.6539C14.9239 10.4162 17.7749 8.89239 20.8786 8.27502C23.9823 7.65766 27.1993 7.97451 30.1229 9.18551C33.0466 10.3965 35.5454 12.4473 37.3035 15.0785C39.0616 17.7096 40 20.8031 40 23.9676C39.9954 28.2096 38.3082 32.2766 35.3086 35.2762C32.309 38.2758 28.242 39.963 24 39.9676Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center justify-center px-2 rounded border-green-500 border-2 text-green-500 bg-transparent w-fit">
                  Verified
                </span>
                <span className="font-medium text-gray-700">
                  Awarded to{" "}
                  <b>
                    {certificate?.attendee.firstName +
                      " " +
                      certificate?.attendee.lastName}
                  </b>
                </span>
                <span className="font-medium text-gray-700">
                  Issued on{" "}
                  {formatDateToHumanReadable(new Date(certificate?.created_at))}{" "}
                </span>
                <span className="font-medium text-gray-700">
                  Issuing organization:{" "}
                  <b>
                    {
                      certificate?.certificate?.event?.organization
                        ?.organizationName
                    }{" "}
                  </b>
                </span>
                <h1 className="text-xl text-gray-900">
                  {certificate?.CertificateName}
                </h1>
              </div>
            </div>
            <div className="space-y-4 w-3/4">
              <h2 className="text-gray-800 text-xl font-medium">
                About Zikoro
              </h2>
              <p className="text-gray-700 text-sm">
                Our platform aims to make event organization easy for event
                organizers, regardless of the event's size, while providing
                attendees with a smooth experience beyond just attending.{" "}
              </p>
              <p className="text-gray-700 text-sm">
                At Zikoro, we empower event organizers to create and distribute
                certificates to attendees of conferences, workshops, and
                seminars, enabling them to define their award criteria.
              </p>
            </div>
            <div className="space-y-4 w-3/4">
              <h2 className="text-gray-800 text-xl font-medium">
                Scope of the training
              </h2>
              <ul className="space-y-2 text-sm">
                {certificate?.certificate?.trainingScope.map((item, index) => (
                  <li className="text-gray-700 flex gap-2" key={index}>
                    <span className="text-xl">.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : !isLoading && !certificate ? (
        <div>this certificate dos not exist</div>
      ) : (
        <div class="flex items-center justify-center h-screen">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
    </section>
  );
};

export default Page;
