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
      pageX: 98,
      pageY: 135,
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
      pageX: 359,
      pageY: 80,
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
      isBold: false,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "h1",
      textAlign: "center",
      textTransform: "uppercase",
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
      text: "ABDUR-RASHEED IDRIS",
      fontSize: 40,
      isBold: false,
      isItalic: false,
      color: "#000",
      isUnderline: false,
      tagName: "p",
      textAlign: "center",
      textTransform: "uppercase",
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
      style: { height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" },
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

  const { certificate, isLoading: certificateIsLoading } = useGetCertificate({
    certificateId: certificateId || "",
  });

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

  // const [json, setJson] = useState<SerializedNodes | string>(
  //   DEFAULT_FRAME_STATE
  // );

  // const json = lz.decompress(lz.decodeBase64(details?.craftHash));

  // useEffect(() => {
  //   console.log(json === DEFAULT_FRAME_STATE, "json state");
  // }, [json]);

  useEffect(() => {
    if (certificateIsLoading || !certificate) return;

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

  const hashRef = useRef<string>("");

  const [{ data: png }, convert, certificateRef] = useToPng<HTMLDivElement>({
    onSuccess: async (data) => {
      console.log(hashRef.current);
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

      const newCertificate = await saveCertificate({
        payload: editableCertificate
          ? {
              ...editableCertificate,
              certficateDetails: { ...details, craftHash: hashRef.current },
              certificateSettings: settings,
              certificateName,
              cerificateUrl: url,
            }
          : {
              eventId: 5,
              certficateDetails: { ...details, craftHash: hashRef.current },
              certificateSettings: settings,
              certificateName,
              cerificateUrl: url,
            },
      });
      console.log(newCertificate);
      setCertificate(newCertificate);
    },
  });

  // const onSave = async (query: string) => {
  //   convert()
  // };

  console.log(details.craftHash);
  console.log(typeof DEFAULT_FRAME_STATE, typeof details.craftHash);

  const SaveButton = () => {
    const { actions, query, enabled } = useEditor((state) => ({
      enabled: state.options.enabled,
    }));

    return (
      <Button
        disabled={isLoading}
        className="flex gap-2"
        variant={"ghost"}
        onClick={() => {
          // const json = query.serialize();
          // hashRef.current = lz.encodeBase64(lz.compress(json));
          hashRef.current = query.serialize();
          convert();
        }}
      >
        {isLoading ? (
          <div className="animate-spin">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
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
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
          </svg>
        )}
        <span>{isLoading ? "Saving..." : "Save"}</span>
      </Button>
    );
  };

  return (
    <Editor resolver={{ Text, Container, ImageElement, QRCode }}>
      <section className="flex flex-col overflow-hidden border-t" ref={divRef}>
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
            <Button className="bg-basePrimary flex gap-4 items-center">
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
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-10">
          <div className="col-span-4 max-h-full overflow-auto">
            <Tabs defaultValue="designs" className="flex">
              <TabsList className="bg-transparent flex flex-col gap-2 justify-between [height:unset_!important] p-0 border-r-2 rounded-none flex-[20%]">
                {tabs.map(({ label, value, icon }) => (
                  <TabsTrigger
                    className="data-[state=active]:shadow-none px-4 py-2 data-[state=active]:bg-basePrimary/5 data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none flex flex-col gap-1 w-full"
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
                  className="flex-[70%] border-r-2 mt-0 max-h-full overflow-auto no-scrollbar"
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
                  backgroundSize: "cover",
                  backgroundImage: !!details.background
                    ? `url(${details.background})`
                    : "",
                  backgroundColor: "#fff",
                  width: "90%",
                  height: "750px",
                }}
                ref={certificateRef}
              >
                <Frame
                  data={
                    JSON.stringify(details?.craftHash) || DEFAULT_FRAME_STATE
                  }
                >
                  {/* <Element
                    className="px-12"
                    canvas
                    is={Container}
                    data-cy="root-container"
                  >
                    <ImageElement
                      src="/images/your_logo.png"
                      width={50}
                      height={50}
                    />
                    <ImageElement
                      src={"/images/zikoro_logo.png"}
                      width={50}
                      height={50}
                    />
                    <Text
                      text={"TRAINING CERTIFICATE"}
                      textAlign={"center"}
                      fontSize={32}
                      tagName={"h1"}
                      textTransform={"uppercase"}
                    />
                    <h1 className="text-2xl uppercase">
                      {details.text.heading}
                    </h1>
                    <Text
                      text={"This is to certify that"}
                      fontSize={16}
                      textAlign="center"
                    />
                    <Text
                      text={"ABDUR-RASHEED IDRIS"}
                      fontSize={40}
                      textAlign="center"
                      fontFamily="DancingScript"
                      textTransform="uppercase"
                    />
                    <Text
                      text={`Successfully completed the ${"XX"}-hour
                        ${"CERTIFICATE NAME"}, earning ${"XX"} credits.`}
                      fontSize={16}
                      textAlign="center"
                    />
                    <Text
                      text={`A program offered by {"ORGANIZATION NAME"}, in
                        collaboration with Zikoro`}
                      fontSize={16}
                      textAlign="center"
                    />

                    <p className="text-xs text-center w-full mb-6">
                      {details.text.showDate &&
                        formatDateToHumanReadable(new Date())}
                      {details.text.showLocation &&
                        details.text.showDate &&
                        ", "}
                      {details.text.showLocation && "LAGOS, NIGERIA"}
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      {details.verification.showQRCode && (
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
                            value={`www.zikoro.com/`}
                            viewBox={`0 0 256 256`}
                          />
                        </div>
                      )}
                      {details.verification.showId && (
                        <h2 className="text-tiny">
                          Certificate ID {1234567890}
                        </h2>
                      )}
                      {details.verification.showURL && (
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
                      )}
                    </div>
                  </Element> */}
                </Frame>
              </div>
            </div>
          </div>
        </section>
      </section>
    </Editor>
  );
};

export default page;
