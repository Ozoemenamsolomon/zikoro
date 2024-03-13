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

  const [hash, setHash] = useState<string | SerializedNodes | undefined>();

  useEffect(() => {
    if (!selectedBadge) return;
    setHash(
      lz.decompress(lz.decodeBase64(selectedBadge.badgeDetails.craftHash))
    );
    console.log(
      "hash set",
      selectedBadge,
      lz.decompress(lz.decodeBase64(selectedBadge.badgeDetails.craftHash))
    );
  }, [selectedBadge]);

  return (
    <>
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
              backgroundRepeat: "no-repeatKach",
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
              {selectedBadge && (
                <Frame
                  data={JSON.parse(
                    lz.decompress(
                      lz.decodeBase64(selectedBadge.badgeDetails.craftHash)
                    )
                  )}
                ></Frame>
              )}
            </Editor>
          </div>
        </div>
      </div>
      <DialogClose asChild>
        <Button disabled={!selectedBadge} className="bg-basePrimary w-full">
          Download badge
        </Button>
      </DialogClose>
    </>
  );
};

export default AttendeeBadge;
