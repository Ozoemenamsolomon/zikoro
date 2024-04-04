import { TAttendee } from "@/types/attendee";
import { Editor, Frame, SerializedNodes } from "@craftjs/core";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Container, SettingsPanel, Text } from "@/components/certificate";
import CertificateQRCode from "@/components/certificate/QRCode";
import { Image as ImageElement } from "@/components/certificate";
import {
  useGetCertificate,
  useGetCertificates,
} from "@/hooks/services/certificate";
import { TCertificate } from "@/types/certificates";
import { DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToPng } from "@hugocxl/react-to-image";
import lz from "lzutf8";
import { toast } from "./ui/use-toast";
import { isPast } from "date-fns";
import { useGetOrganization } from "@/hooks/services/organization";
import { useGetEvent } from "@/hooks/services/events";
import { replaceSpecialText } from "@/utils/helpers";

const AttendeeCertificate = ({
  attendee,
  certificateId,
}: {
  attendee: TAttendee;
  certificateId: string;
  releaseCertificate: () => Promise<void>;
}) => {
  const { certificate, isLoading } = useGetCertificate({ certificateId });
  const {
    organization,
    isLoading: organizationIsLoading,
    getOrganization,
  } = useGetOrganization({
    organizationId: 5,
  });
  const {
    event,
    isLoading: eventIsLoading,
    getEvent,
  } = useGetEvent({ eventId: 5 });

  console.log(certificate);

  const [data, download] = useToPng<HTMLDivElement>({
    selector: "#certificate",
    onSuccess: (data) => {
      console.log("downloading");
      const link = document.createElement("a");
      link.download =
        certificate?.certificateName +
        "_certificate_for_" +
        attendee.firstName +
        "_" +
        attendee.lastName +
        ".jpeg";
      link.href = data;
      link.click();
    },
  });

  const hashRef = useRef<string | SerializedNodes | undefined>();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isLoading || organizationIsLoading || eventIsLoading) {
      return;
    }

    if (!certificate || !event || !organization) {
      btnRef.current?.click();
      toast({
        variant: "destructive",
        description: "Certificate does not exist",
      });
      return; // Exit early after showing the toast
    }

    if (
      !attendee.id ||
      (certificate.certificateSettings.canReceive.exceptions &&
        certificate.certificateSettings.canReceive.exceptions.includes(
          attendee.id
        ))
    ) {
      btnRef.current?.click();
      toast({
        variant: "destructive",
        description: "Certificate cannot be released for this attendee",
      });
      return; // Exit early after showing the toast
    }

    // if (
    //   certificate.certificateSettings.publishOn &&
    //   !isPast(new Date(certificate.certificateSettings.publishOn))
    // ) {
    //   btnRef.current?.click();
    //   toast({
    //     variant: "destructive",
    //     description: "Certificate has not been published yet",
    //   });
    //   return; // Exit early after showing the toast
    // }

    if (
      certificate.certficateDetails &&
      certificate.certficateDetails.craftHash
    ) {
      const initData = lz.decompress(
        lz.decodeBase64(certificate.certficateDetails.craftHash)
      );

      hashRef.current = JSON.parse(
        replaceSpecialText(JSON.stringify(initData), {
          attendee,
          event,
          organization,
        })
      );
      console.log("hash set", hashRef.current);
    }
  }, [isLoading, organizationIsLoading, eventIsLoading]);

  console.log(attendee);

  return (
    <Editor
      enabled={false}
      resolver={{
        Text,
        Container,
        ImageElement,
        QRCode,
        CertificateQRCode,
      }}
    >
      <div className="h-[80vh] flex flex-col gap-2 overflow-auto no-scrollbar space-y-2 py-4">
        <div className="flex justify-center [&>*]:scale-75 h-fit">
          <div className="relative">
            <div className="w-full h-full absolute bg-transparent z-[100]" />
            <div
              className="relative w-4/5 h-fit space-y-6 text-black bg-no-repeat"
              style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                backgroundImage: !!certificate?.certficateDetails?.background
                  ? `url(${certificate?.certficateDetails?.background})`
                  : "",
                backgroundColor: "#fff",
                width: "90%",
                height: "750px",
              }}
              id="certificate"
            >
              {!(isLoading || organizationIsLoading || eventIsLoading) ? (
                <>{hashRef.current && <Frame data={hashRef.current}></Frame>}</>
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
          </div>
        </div>
      </div>
      <DialogClose asChild>
        <Button
          disabled={
            !certificate || isLoading || organizationIsLoading || eventIsLoading
          }
          ref={btnRef}
          className="bg-basePrimary w-full"
          onClick={download}
        >
          Download certificate
        </Button>
      </DialogClose>
    </Editor>
  );
};

export default AttendeeCertificate;
