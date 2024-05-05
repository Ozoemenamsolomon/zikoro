import { TAttendee } from "@/types/attendee";
import { Editor, Element, Frame, SerializedNodes } from "@craftjs/core";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Container, SettingsPanel, Text } from "@/components/certificate";
import CertificateQRCode from "@/components/certificate/QRCode";
import { Image as ImageElement } from "@/components/certificate";
import { TBadge } from "@/types/badge";
import { DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToPng } from "@hugocxl/react-to-image";
import lz from "lzutf8";
import useEventStore from "@/store/globalEventStore";
import { replaceSpecialText } from "@/utils/helpers";

const AttendeeBadge = ({
  attendee,
  badge,
}: {
  attendee: TAttendee;
  badge: TBadge;
}) => {
  const currentEvent = useEventStore((state) => state.event);

  console.log(badge);

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

  const hashRef = useRef<string>(
    lz.decompress(lz.decodeBase64(badge.badgeDetails.craftHash))
  );

  console.log(hashRef.current);

  // useEffect(() => {
  //   if (!badge) return;
  //   const initData = lz.decompress(
  //     lz.decodeBase64(badge.badgeDetails.craftHash)
  //   );

  //   // hashRef.current = JSON.parse(
  //   //   replaceSpecialText(JSON.stringify(initData), {
  //   //     asset: badge,
  //   //     attendee,
  //   //     event: currentEvent,
  //   //     organization: currentEvent.organization,
  //   //   })
  //   // );

  //   hashRef.current = ;

  //   console.log(
  //     "hash set",
  //     badge,
  //     lz.decompress(lz.decodeBase64(badge.badgeDetails.craftHash)),
  //     hashRef.current
  //   );
  // }, [badge]);

  return (
    <div className="h-full flex flex-col gap-2 overflow-auto no-scrollbar space-y-2 py-4">
      <div
        className={`relative w-4/5 h-fit space-y-6 text-black bg-no-repeat`}
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundImage: !!badge.badgeDetails.background
            ? `url(${badge.badgeDetails.background})`
            : "",
          backgroundColor: "#fff",
          width: "90%",
          height: "750px",
        }}
        id="badge"
      >
        {hashRef.current && (
          <Editor
            key={badge.id}
            enabled={false}
            resolver={{
              Text,
              Container,
              ImageElement,
              QRCode,
              CertificateQRCode,
            }}
          >
            <Frame
              data={{
                ROOT: {
                  type: {
                    resolvedName: "Container",
                  },
                  isCanvas: true,
                  props: {
                    className: "px-12 h-full w-full",
                    "data-cy": "root-container",
                  },
                  displayName: "Container",
                  custom: {},
                  hidden: false,
                  nodes: ["9aFSoGH9T", "oUyHw1kORv"],
                  linkedNodes: {},
                },
                oUyHw1kORv: {
                  type: {
                    resolvedName: "BadgeQRCode",
                  },
                  isCanvas: false,
                  props: {
                    url: "this",
                    size: 128,
                    color: "#000000",
                    pageX: 90,
                    pageY: 217,
                  },
                  displayName: "CertificateQRCode",
                  custom: {},
                  parent: "ROOT",
                  hidden: false,
                  nodes: [],
                  linkedNodes: {},
                },
                "9aFSoGH9T": {
                  type: {
                    resolvedName: "Text",
                  },
                  isCanvas: false,
                  props: {
                    text: "#{first_name#} #{last_name#}",
                    fontSize: 28,
                    isBold: true,
                    isItalic: true,
                    color: "#ffffff",
                    isUnderline: false,
                    tagName: "p",
                    textAlign: "center",
                    textTransform: "none",
                    pageX: 10,
                    pageY: 161,
                    isNotEditable: true,
                  },
                  displayName: "Text",
                  custom: {},
                  parent: "ROOT",
                  hidden: false,
                  nodes: [],
                  linkedNodes: {},
                },
              }}
            >
              <Element is={Container} canvas className="w-full h-full">
                <Text text={"example text"} />
              </Element>
            </Frame>
          </Editor>
        )}
      </div>
      <DialogClose asChild>
        <Button disabled={!badge} className="bg-basePrimary w-full">
          Download badge
        </Button>
      </DialogClose>
    </div>
  );
};

export default AttendeeBadge;
