"use client";
import {
  Editor,
  Element,
  Frame,
  SerializedNode,
  SerializedNodes,
  useEditor,
} from "@craftjs/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  base64ToFile,
  calculateAndSetMaxHeight,
  uploadFile,
} from "@/utils/helpers";
import { Container, SettingsPanel, Text } from "@/components/certificate";
import Designs from "./_tabs/Designs";
import ElementTab from "./_tabs/Element";
import TextTab from "./_tabs/Text";
import Verification from "./_tabs/verification";
import Settings from "./_tabs/Settings";
import QRCode from "react-qr-code";
import { formatDateToHumanReadable } from "@/utils/date";
import Background from "./_tabs/Background";
import {
  TCertificate,
  TCertificateDetails,
  TCertificateSettings,
} from "@/types/certificates";
import useUndo from "use-undo";
import {
  useGetCertificate,
  useSaveCertificate,
} from "@/hooks/services/certificate";
import { Image as ImageElement } from "@/components/certificate";
import lz from "lzutf8";
import { exportComponentAsPNG } from "react-component-export-image";
import { useToPng } from "@hugocxl/react-to-image";
import CertificateQRCode from "@/components/certificate/QRCode";
import { useGetEvent } from "@/hooks/services/events";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const tabs = [
  {
    label: "designs",
    value: "designs",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 1024 1024"
        height="2em"
        width="2em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-696 72h136v656H184V184zm656 656H384V384h456v456zM384 320V184h456v136H384z" />
      </svg>
    ),
    Component: ({ ...props }: TabProps) => <Designs {...props} />,
  },
  {
    label: "background",
    value: "background",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 512 512"
        height="1.8em"
        width="1.8em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z" />
      </svg>
    ),
    Component: ({ ...props }: TabProps) => <Background {...props} />,
  },
  {
    label: "text",
    value: "text",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 16 16"
        height="1.8em"
        width="1.8em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M14 9a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4zM2 9a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M1.5 2.5A1.5 1.5 0 013 1h10a1.5 1.5 0 011.5 1.5v4h-1v-4A.5.5 0 0013 2H3a.5.5 0 00-.5.5v4h-1v-4zm1 7v4a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-4h1v4A1.5 1.5 0 0113 15H3a1.5 1.5 0 01-1.5-1.5v-4h1z"
          clipRule="evenodd"
        />
        <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386L11.434 4z" />
      </svg>
    ),
    Component: ({ ...props }: TabProps) => <TextTab {...props} />,
  },
  {
    label: "element",
    value: "element",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 16 16"
        height="2em"
        width="2em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"
          clipRule="evenodd"
        />
      </svg>
    ),
    Component: ({ ...props }: TabProps) => <ElementTab {...props} />,
  },
  {
    label: "verification",
    value: "verification",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 640 512"
        height="2em"
        width="2em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M622.3 271.1l-115.2-45c-4.1-1.6-12.6-3.7-22.2 0l-115.2 45c-10.7 4.2-17.7 14-17.7 24.9 0 111.6 68.7 188.8 132.9 213.9 9.6 3.7 18 1.6 22.2 0C558.4 489.9 640 420.5 640 296c0-10.9-7-20.7-17.7-24.9zM496 462.4V273.3l95.5 37.3c-5.6 87.1-60.9 135.4-95.5 151.8zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm96 40c0-2.5.8-4.8 1.1-7.2-2.5-.1-4.9-.8-7.5-.8h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c6.8 0 13.3-1.5 19.2-4-54-42.9-99.2-116.7-99.2-212z" />
      </svg>
    ),
    Component: ({ ...props }: TabProps) => <Verification {...props} />,
  },
  {
    label: "settings",
    value: "settings",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 512 512"
        height="2em"
        width="2em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M416.3 256c0-21 13.1-38.9 31.7-46.1-4.9-20.5-13-39.7-23.7-57.1-6.4 2.8-13.2 4.3-20.1 4.3-12.6 0-25.2-4.8-34.9-14.4-14.9-14.9-18.2-36.8-10.2-55-17.3-10.7-36.6-18.8-57-23.7C295 82.5 277 95.7 256 95.7S217 82.5 209.9 64c-20.5 4.9-39.7 13-57.1 23.7 8.1 18.1 4.7 40.1-10.2 55-9.6 9.6-22.3 14.4-34.9 14.4-6.9 0-13.7-1.4-20.1-4.3C77 170.3 68.9 189.5 64 210c18.5 7.1 31.7 25 31.7 46.1 0 21-13.1 38.9-31.6 46.1 4.9 20.5 13 39.7 23.7 57.1 6.4-2.8 13.2-4.2 20-4.2 12.6 0 25.2 4.8 34.9 14.4 14.8 14.8 18.2 36.8 10.2 54.9 17.4 10.7 36.7 18.8 57.1 23.7 7.1-18.5 25-31.6 46-31.6s38.9 13.1 46 31.6c20.5-4.9 39.7-13 57.1-23.7-8-18.1-4.6-40 10.2-54.9 9.6-9.6 22.2-14.4 34.9-14.4 6.8 0 13.7 1.4 20 4.2 10.7-17.4 18.8-36.7 23.7-57.1-18.4-7.2-31.6-25.1-31.6-46.2zm-159.4 79.9c-44.3 0-80-35.9-80-80s35.7-80 80-80 80 35.9 80 80-35.7 80-80 80z" />
      </svg>
    ),
    Component: ({ ...props }: TabProps) => <Settings {...props} />,
  },
];

const DEFAULT_FRAME_STATE: SerializedNodes = {
  // @ts-ignore
  ROOT: {
    type: { resolvedName: "Container" },
    isCanvas: true,
    props: { className: "px-12", "data-cy": "root-container" },
    displayName: "Container",
    custom: {},
    hidden: false,
    nodes: [
      "jRhdIGLpF6",
      "dctg3UrG0u",
      "MrWpdo15n4",
      "UAyB7m2OTd",
      "G_9evjnPXh",
      "ejgclGttJ2",
      "48bTDW8UT_",
      "Y1aEfA-fvY",
    ],
    linkedNodes: {},
  },
  jRhdIGLpF6: {
    type: { resolvedName: "ImageElement" },
    isCanvas: false,
    props: {
      src: "/images/your_logo.png",
      width: 50,
      height: 50,
      pageX: -32,
      pageY: 20,
    },
    displayName: "Image",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  dctg3UrG0u: {
    type: { resolvedName: "ImageElement" },
    isCanvas: false,
    props: {
      src: "/images/zikoro_logo.png",
      width: 50,
      height: 50,
      pageX: 463,
      pageY: -37,
    },
    displayName: "Image",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  MrWpdo15n4: {
    type: { resolvedName: "Text" },
    isCanvas: false,
    props: {
      text: "TRAINING CERTIFICATE",
      fontSize: 32,
      isBold: true,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "h1",
      textAlign: "center",
      textTransform: "uppercase",
      pageX: -8,
      pageY: 1,
    },
    displayName: "Text",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  UAyB7m2OTd: {
    type: { resolvedName: "Text" },
    isCanvas: false,
    props: {
      text: "This is to certify that",
      fontSize: 16,
      isBold: false,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "p",
      textAlign: "center",
      textTransform: "none",
      pageX: 15,
      pageY: 291,
    },
    displayName: "Text",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  G_9evjnPXh: {
    type: { resolvedName: "Text" },
    isCanvas: false,
    props: {
      text: "JOHN DOE",
      fontSize: 40,
      isBold: false,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "p",
      textAlign: "center",
      textTransform: "uppercase",
      pageX: 1,
      pageY: -5,
      fontFamily: "DancingScript",
    },
    displayName: "Text",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  ejgclGttJ2: {
    type: { resolvedName: "Text" },
    isCanvas: false,
    props: {
      text: "Successfully completed the XX-hour\n                        CERTIFICATE NAME, earning XX credits.",
      fontSize: 16,
      isBold: false,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "p",
      textAlign: "center",
      textTransform: "none",
      pageX: 3,
      pageY: 14,
    },
    displayName: "Text",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  "48bTDW8UT_": {
    type: { resolvedName: "Text" },
    isCanvas: false,
    props: {
      text: 'A program offered by {"ORGANIZATION NAME"}, in\n                        collaboration with Zikoro',
      fontSize: 16,
      isBold: false,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "p",
      textAlign: "center",
      textTransform: "none",
      pageX: 24,
      pageY: 202,
    },
    displayName: "Text",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  "Y1aEfA-fvY": {
    type: "div",
    isCanvas: false,
    props: { className: "flex flex-col items-center gap-2" },
    displayName: "div",
    custom: {},
    parent: "ROOT",
    hidden: false,
    nodes: ["z55csfWw8N"],
    linkedNodes: {},
  },
  z55csfWw8N: {
    type: "div",
    isCanvas: false,
    props: {
      style: {
        height: "auto",
        margin: "0 auto",
        maxWidth: 64,
        width: "100%",
        display: "none",
      },
    },
    displayName: "div",
    custom: {},
    parent: "Y1aEfA-fvY",
    hidden: false,
    nodes: ["MdIdRUSVrQ"],
    linkedNodes: {},
  },
  MdIdRUSVrQ: {
    type: { resolvedName: "QRCode" },
    isCanvas: false,
    props: {
      size: 256,
      style: { height: "auto", maxWidth: "100%", width: "100%" },
      value: "www.zikoro.com/",
      viewBox: "0 0 256 256",
      bgColor: "#FFFFFF",
      fgColor: "#000000",
      level: "L",
    },
    displayName: "QRCode",
    custom: {},
    parent: "z55csfWw8N",
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
};

export interface TabProps {
  details: TCertificateDetails;
  setValue: (key: keyof TCertificateDetails, value: any) => void;
  settings: TCertificateSettings;
  editSettings: (key: keyof TCertificateSettings, value: any) => void;
}

const page = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const certificateDivRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  const certificateId = searchParams.get("certificateId");
  const eventId = searchParams.get("eventId");

  const { certificate, isLoading: certificateIsLoading } = useGetCertificate({
    certificateId: certificateId || "0",
  });

  const { event, isLoading: eventIsLoading } = useGetEvent({
    eventId: parseInt(eventId || "0"),
  });

  console.log(event, "event");

  const [editableCertificate, setCertificate] = useState<TCertificate | null>(
    null
  );

  const { saveCertificate, isLoading } = useSaveCertificate();

  const [certificateName, setName] = useState<string>("Untitled Certificate");
  const [
    detailState,
    { set: setDetails, undo: undoDetails, redo: redoDetails },
  ] = useUndo<TCertificateDetails>({
    craftHash: "",
    verification: { showId: true, showQRCode: true, showURL: true },
    background: null,
  });
  const { present: details } = detailState;

  useEffect(() => {
    if (certificateIsLoading) return;

    if (!certificateId) {
      hashRef.current = DEFAULT_FRAME_STATE;
    }

    console.log(certificate);

    setCertificate(certificate);

    if (certificate?.certificateName) {
      setName(certificate?.certificateName);
    }
    if (certificate?.certficateDetails) {
      setDetails(certificate?.certficateDetails);
    }
    if (certificate?.certificateSettings) {
      setSettings(certificate?.certificateSettings);
    }

    if (
      certificate?.certficateDetails?.craftHash &&
      typeof certificate?.certficateDetails?.craftHash === "string"
    ) {
      console.log(certificate?.certficateDetails?.craftHash, "craft hash");
      hashRef.current = lz.decompress(
        lz.decodeBase64(certificate?.certficateDetails?.craftHash)
      );
      console.log(hashRef.current);
    }
  }, [certificateIsLoading]);

  const [settings, setSettings] = useState<TCertificateSettings>({
    size: "A4",
    orientation: "portrait",
    canReceive: {
      eventAttendees: true,
      quizParticipants: false,
      sessionAttendees: false,
      trackAttendees: false,
    },
    criteria: 100,
    canExpire: false,
    expiryDate: new Date(),
    publishOn: new Date(event?.endDateTime || new Date()) || new Date(),
    skills: [],
  });

  useLayoutEffect(() => {
    const div = divRef.current;
    const certificateDiv = certificateDivRef.current;

    if (!div || !certificateDiv) return;
    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;
    const secondDistanceToBottom =
      window.innerHeight - certificateDiv.offsetTop;

    // Set the maximum height of the div
    div.style.maxHeight = `${distanceToBottom}px`;
    certificateDiv.style.maxHeight = `${secondDistanceToBottom}px`;
  }, []);

  const setValue = (key: keyof TCertificateDetails, value: any) => {
    console.log(key + ": " + value);
    setDetails({ ...details, [key]: value });
  };

  const editSettings = (key: keyof TCertificateSettings, value: any) => {
    console.log(key + ": " + value);
    setSettings({ ...settings, [key]: value });
  };

  useEffect(() => {
    if (eventIsLoading || !event || !event.endDateTime) return;

    editSettings("publishOn", new Date(event.endDateTime));
  }, [event]);

  const hashRef = useRef<string | undefined>();

  const [imageIsUploading, setUploading] = useState<boolean>(false);
  const [data, download] = useToPng<HTMLDivElement>({
    selector: "#certificate",
    onSuccess: (data) => {
      console.log("downloading");
      const link = document.createElement("a");
      link.download = certificateName + ".jpeg";
      link.href = data;
      link.click();
    },
  });
  const [{ data: png }, convert, certificateRef] = useToPng<HTMLDivElement>({
    onSuccess: async (data) => {
      setUploading(true);
      console.log(hashRef.current, "what you get");
      console.log(data, "image");

      // const img = new Image();
      // img.src = data;

      const snapshot = base64ToFile(
        data,
        certificateName + new Date().toISOString()
      );
      const { url, error } = await uploadFile(snapshot, "image");

      if (error || !url) throw error;
      console.log(url);
      // alert("File uploaded successfully", url);

      if (!hashRef.current) return;

      console.log(editableCertificate);
      const newCertificate = await saveCertificate({
        payload: editableCertificate
          ? {
              ...editableCertificate,
              certficateDetails: { ...details, craftHash: hashRef.current },
              certificateSettings: settings,
              certificateName,
              cerificateUrl: url,
              lastEdited: new Date(),
            }
          : {
              eventId: 5,
              certficateDetails: { ...details, craftHash: hashRef.current },
              certificateSettings: settings,
              certificateName,
              lastEdited: new Date(),
              cerificateUrl: url,
            },
      });
      console.log(newCertificate);

      if (newCertificate) {
        setCertificate(newCertificate);
        router.push(
          "/content/certificate/create?certificateId=" + newCertificate.id
        );
      }
      setUploading(false);
    },
  });

  // const onSave = async (query: string) => {
  //   convert()
  // };

  console.log(details.craftHash);

  const PreviewButton = () => {
    const { actions, query, enabled } = useEditor((state) => ({
      enabled: state.options.enabled,
    }));

    const [previewImg, setImg] = useState<string | null>(null);

    const [{ data: previewPNG }, preview] = useToPng<HTMLDivElement>({
      selector: "#certificate",
      onSuccess: (data) => setImg(data),
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={isLoading || imageIsUploading}
            className="bg-basePrimary w-full"
            onClick={preview}
          >
            <span>
              {isLoading || imageIsUploading ? "Saving..." : "Preview"}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2 pt-6 z-[100] overflow-auto no-scrollbar">
          <DialogHeader className="px-3">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="!h-fit">
              {previewImg ? (
                <div className="h-fit flex justify-center">
                  <img
                    alt={"preview image for" + certificate?.certificateName}
                    className="h-[420px] w-[290px]"
                    src={previewImg}
                  />
                </div>
              ) : (
                <div className="h-[100px] w-full flex items-center justify-center">
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
            <DialogClose asChild>
              <Button
                disabled={!previewImg}
                onClick={() => {
                  const json = query.serialize();
                  hashRef.current = lz.encodeBase64(lz.compress(json));
                  console.log(
                    lz.encodeBase64(lz.compress(json)),
                    "what you see"
                  );
                  convert();
                }}
                className="bg-basePrimary w-full"
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const SaveButton = () => {
    const { actions, query, enabled } = useEditor((state) => ({
      enabled: state.options.enabled,
    }));

    return (
      <Button
        disabled={isLoading || imageIsUploading}
        className="flex gap-2"
        variant={"ghost"}
        onClick={() => {
          const json = query.serialize();
          hashRef.current = lz.encodeBase64(lz.compress(json));
          console.log(lz.encodeBase64(lz.compress(json)), "what you see");
          convert();
        }}
      >
        {isLoading || imageIsUploading ? (
          <div className="animate-spin">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 1024 1024"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
            </svg>
          </div>
        ) : (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 1024 1024"
            height="1.5em"
            width="1.5em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
          </svg>
        )}
        <span>{isLoading || imageIsUploading ? "Saving..." : "Save"}</span>
      </Button>
    );
  };

  return (
    <Editor
      resolver={{ Text, Container, ImageElement, QRCode, CertificateQRCode }}
    >
      <section className="flex flex-col overflow-hidden" ref={divRef}>
        <section className="border-b flex justify-between px-4 py-2">
          <Button
            className="flex gap-2"
            variant={"ghost"}
            onClick={() => router.back()}
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
              <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z" />
            </svg>

            <span>Back</span>
          </Button>
          <Input
            type="text"
            className="outline-0 bg-transparent border-0 max-w-fit px-4 focus-visible:ring-sky-300 flex justify-center"
            value={certificateName}
            onInput={(e) => setName(e.currentTarget.value)}
          />
          <div className="flex gap-2">
            <SaveButton />
            <PreviewButton />
            {/* <Button
              className="bg-basePrimary flex gap-4 items-center"
              onClick={download}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 24 24"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.9498 5.96781L15.5356 7.38203L13 4.84646V17.0421H11V4.84653L8.46451 7.38203L7.05029 5.96781L12 1.01807L16.9498 5.96781Z"
                  fill="currentColor"
                />
                <path
                  d="M5 20.9819V10.9819H9V8.98193H3V22.9819H21V8.98193H15V10.9819H19V20.9819H5Z"
                  fill="currentColor"
                />
              </svg>

              <span>Export</span>
            </Button> */}
          </div>
        </section>

        <section className="grid grid-cols-10">
          <div className="col-span-4 max-h-full overflow-auto">
            <Tabs defaultValue="designs" className="flex h-full">
              <TabsList className="bg-transparent flex flex-col [justify-content:_unset_!important] gap-2 p-0 border-r rounded-none flex-[20%] h-full">
                {tabs.map(({ label, value, icon }) => (
                  <TabsTrigger
                    className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-basePrimary/5 data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none flex flex-col gap-1 w-full"
                    value={value}
                  >
                    {icon}
                    <span className="capitalize">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map(({ label, value, Component }) => (
                <TabsContent
                  value={value}
                  className="flex-[70%] border-r mt-0 max-h-full overflow-auto no-scrollbar"
                  key={value}
                >
                  <h3 className="border-b py-2 px-4 text-lg font-semibold text-gray-800 capitalize">
                    {label}
                  </h3>
                  <div className="p-2 h-full overflow-auto">
                    {
                      <Component
                        settings={settings}
                        editSettings={editSettings}
                        details={details}
                        setValue={setValue}
                      />
                    }
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="col-span-6 flex flex-col items-center bg-basebody">
            <div className="grid grid-cols-10 bg-white w-full">
              <div className="col-span-2 flex gap-4 text-gray-500 py-2 px-4">
                <button onClick={undoDetails}>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9,10h6c1.654,0,3,1.346,3,3s-1.346,3-3,3h-3v2h3c2.757,0,5-2.243,5-5s-2.243-5-5-5H9V5L4,9l5,4V10z" />
                  </svg>
                </button>
                <button onClick={redoDetails}>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9,18h3v-2H9c-1.654,0-3-1.346-3-3s1.346-3,3-3h6v3l5-4l-5-4v3H9c-2.757,0-5,2.243-5,5S6.243,18,9,18z" />
                  </svg>
                </button>
              </div>
              <div className="col-span-8">
                <SettingsPanel />
              </div>
            </div>
            <div
              className="py-6 overflow-auto w-full no-scrollbar flex justify-center"
              ref={certificateDivRef}
            >
              <div
                className="relative w-4/5 h-fit space-y-6 text-black bg-no-repeat"
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                  backgroundImage: !!details.background
                    ? `url(${details.background})`
                    : "",
                  backgroundColor: "#fff",
                  width: "90%",
                  height: "750px",
                }}
                ref={certificateRef}
                id="certificate"
              >
                {!certificateIsLoading ? (
                  <>
                    {hashRef.current && <Frame data={hashRef.current}></Frame>}
                  </>
                ) : (
                  <div className="h-1/2 w-full flex items-center justify-center">
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
        </section>
      </section>
    </Editor>
  );
};

export default page;
