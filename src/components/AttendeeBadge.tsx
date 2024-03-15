import { TAttendee } from "@/types/attendee";
import { Editor, Frame, SerializedNodes } from "@craftjs/core";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Container, SettingsPanel, Text } from "@/components/certificate";
import CertificateQRCode from "@/components/certificate/QRCode";
import { Image as ImageElement } from "@/components/certificate";
import { useGetBadge, useGetBadges } from "@/hooks/services/badge";
import { TBadge } from "@/types/badge";
import { DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToPng } from "@hugocxl/react-to-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import lz from "lzutf8";

const AttendeeBadge = ({ attendee }: { attendee: TAttendee }) => {
  const { badges, isLoading } = useGetBadges({ eventId: 5 });

  const [selectedBadge, setBadge] = useState<TBadge | null>(null);

  const [data, download] = useToPng<HTMLDivElement>({
    selector: "#badge",
    onSuccess: (data) => {
      console.log("downloading");
      const link = document.createElement("a");
      link.download =
        attendee.firstName + "-" + attendee.lastName + "-" + ".jpeg";
      link.href = data;
      link.click();
    },
  });

  const hashRef = useRef<string | SerializedNodes | undefined>();

  useEffect(() => {
    if (!selectedBadge) return;
    hashRef.current = lz.decompress(
      lz.decodeBase64(selectedBadge.badgeDetails.craftHash)
    );
    console.log(
      "hash set",
      selectedBadge,
      lz.decompress(lz.decodeBase64(selectedBadge.badgeDetails.craftHash))
    );
  }, [selectedBadge]);

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
      <div className="h-[60vh] flex flex-col gap-2 overflow-auto no-scrollbar space-y-2 py-4">
        <div className="relative">
          <label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
            Badge Name
          </label>
          <Select
            onValueChange={(value) =>
              setBadge(
                badges
                  ? badges?.find(({ id }) => id === parseInt(value)) || null
                  : null
              )
            }
            value={
              (selectedBadge &&
                selectedBadge.id &&
                selectedBadge.id.toString()) ||
              ""
            }
          >
            <SelectTrigger disabled={isLoading}>
              <SelectValue
                placeholder={!isLoading ? "Select event" : "Loading..."}
                className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
              />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] w-[500px] hide-scrollbar overflow-auto z-[10000]">
              {badges &&
                badges.map(({ id, badgeName }) => (
                  <SelectItem
                    key={id}
                    value={id.toString()}
                    className="inline-flex gap-2"
                  >
                    {badgeName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center [&>*]:scale-75">
          <div
            className="relative w-4/5 h-fit space-y-6 text-black bg-no-repeat"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              backgroundImage: !!selectedBadge?.badgeDetails.background
                ? `url(${selectedBadge?.badgeDetails.background})`
                : "",
              backgroundColor: "#fff",
              width: "90%",
              height: "750px",
            }}
            id="badge"
          >
            {!isLoading ? (
              <>
                {hashRef.current && (
                  <Frame
                    data={{
                      ROOT: {
                        type: { resolvedName: "Container" },
                        isCanvas: true,
                        props: {
                          className: "px-12 h-full w-full",
                          "data-cy": "root-container",
                        },
                        displayName: "Container",
                        custom: {},
                        hidden: false,
                        nodes: ["fwxI1M2zXh", "gP2wtYjklF"],
                        linkedNodes: {},
                      },
                      fwxI1M2zXh: {
                        type: { resolvedName: "Text" },
                        isCanvas: false,
                        props: {
                          text: "heading",
                          fontSize: 50,
                          isBold: true,
                          isItalic: false,
                          color: "#ffffff",
                          isUnderline: false,
                          tagName: "h1",
                          textAlign: "center",
                          textTransform: "uppercase",
                          pageX: 32,
                          pageY: 89,
                          isNotEditable: false,
                        },
                        displayName: "Text",
                        custom: {},
                        parent: "ROOT",
                        hidden: false,
                        nodes: [],
                        linkedNodes: {},
                      },
                      gP2wtYjklF: {
                        type: { resolvedName: "BadgeQRCode" },
                        isCanvas: false,
                        props: {
                          url: "this",
                          size: 128,
                          color: "#00000",
                          pageX: 88,
                          pageY: 146,
                        },
                        displayName: "CertificateQRCode",
                        custom: {},
                        parent: "ROOT",
                        hidden: false,
                        nodes: [],
                        linkedNodes: {},
                      },
                    }}
                  ></Frame>
                )}
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
        </div>
      </div>
      <DialogClose asChild>
        <Button disabled={!selectedBadge} className="bg-basePrimary w-full">
          Download badge
        </Button>
      </DialogClose>
    </Editor>
  );
};

export default AttendeeBadge;
