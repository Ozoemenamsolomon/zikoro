"use client";
import { Input } from "@/components";
import { Button } from "@/components/ui/button";
import { useGetAttendees, useGetBadge, useSaveBadge } from "@/hooks";
import { TAttendee, TBadge, TBadgeSettings } from "@/types";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import {
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ViewAttendeesSection from "@/components/moreOptionDialog/viewAttendeesSection";
import { StoreType } from "polotno/model/store";
import { uploadFile } from "@/utils/helpers";

const Editor = dynamic(() => import("@/components/GraphicsEditor/editor"), {
  ssr: false,
});

const DEFAULT_JSON = {
  width: 595.2755905511812,
  height: 841.8897637795276,
  fonts: [],
  pages: [
    {
      id: "dDGaps0f-w",
      children: [
        {
          id: "E5f7nhJMII",
          type: "text",
          name: "",
          opacity: 1,
          visible: true,
          selectable: true,
          removable: true,
          alwaysOnTop: false,
          showInExport: true,
          x: 83.66773392241805,
          y: 402.4448818897638,
          width: 157,
          height: 37,
          rotation: 0,
          animations: [],
          blurEnabled: false,
          blurRadius: 10,
          brightnessEnabled: false,
          brightness: 0,
          sepiaEnabled: false,
          grayscaleEnabled: false,
          shadowEnabled: false,
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "black",
          shadowOpacity: 1,
          draggable: true,
          resizable: true,
          contentEditable: true,
          styleEditable: true,
          text: "Front Page<HTMLDivElement>",
          placeholder: "",
          fontSize: 30,
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "normal",
          textDecoration: "",
          fill: "black",
          align: "center",
          verticalAlign: "top",
          strokeWidth: 0,
          stroke: "black",
          lineHeight: 1.2,
          letterSpacing: 0,
          backgroundEnabled: false,
          backgroundColor: "#7ED321",
          backgroundOpacity: 1,
          backgroundCornerRadius: 0.5,
          backgroundPadding: 0.5,
        },
        {
          id: "uJose2-EI4",
          type: "text",
          name: "",
          opacity: 1,
          visible: true,
          selectable: true,
          removable: true,
          alwaysOnTop: false,
          showInExport: true,
          x: 361.0019148742077,
          y: 402.44488188976374,
          width: 159,
          height: 37,
          rotation: 0,
          animations: [],
          blurEnabled: false,
          blurRadius: 10,
          brightnessEnabled: false,
          brightness: 0,
          sepiaEnabled: false,
          grayscaleEnabled: false,
          shadowEnabled: false,
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "black",
          shadowOpacity: 1,
          draggable: true,
          resizable: true,
          contentEditable: true,
          styleEditable: true,
          text: "Back Page",
          placeholder: "",
          fontSize: 30,
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "normal",
          textDecoration: "",
          fill: "black",
          align: "center",
          verticalAlign: "top",
          strokeWidth: 0,
          stroke: "black",
          lineHeight: 1.2,
          letterSpacing: 0,
          backgroundEnabled: false,
          backgroundColor: "#7ED321",
          backgroundOpacity: 1,
          backgroundCornerRadius: 0.5,
          backgroundPadding: 0.5,
        },
        {
          id: "np671LPbnp",
          type: "group",
          name: "",
          opacity: 1,
          visible: true,
          selectable: true,
          removable: true,
          alwaysOnTop: false,
          showInExport: true,
          children: [
            {
              id: "mvJbAt62HS",
              type: "line",
              name: "",
              opacity: 1,
              visible: true,
              selectable: true,
              removable: true,
              alwaysOnTop: false,
              showInExport: true,
              x: 299.5079884365382,
              y: 124.26562220267525,
              width: 607.0622462048799,
              height: 2.006753691367091,
              rotation: 90,
              animations: [],
              blurEnabled: false,
              blurRadius: 10,
              brightnessEnabled: false,
              brightness: 0,
              sepiaEnabled: false,
              grayscaleEnabled: false,
              shadowEnabled: false,
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "black",
              shadowOpacity: 1,
              draggable: true,
              resizable: true,
              contentEditable: true,
              styleEditable: true,
              color: "black",
              dash: [4, 1],
              startHead: "",
              endHead: "",
            },
            {
              id: "z807cARlyw",
              type: "line",
              name: "",
              opacity: 1,
              visible: true,
              selectable: true,
              removable: true,
              alwaysOnTop: false,
              showInExport: true,
              x: 4.4941828036826337e-13,
              y: 731.3278684075549,
              width: 597.0092231817086,
              height: 2.006753691367091,
              rotation: 0,
              animations: [],
              blurEnabled: false,
              blurRadius: 10,
              brightnessEnabled: false,
              brightness: 0,
              sepiaEnabled: false,
              grayscaleEnabled: false,
              shadowEnabled: false,
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "black",
              shadowOpacity: 1,
              draggable: true,
              resizable: true,
              contentEditable: true,
              styleEditable: true,
              color: "black",
              dash: [4, 1],
              startHead: "",
              endHead: "",
            },
            {
              id: "wywaCr2Jl9",
              type: "line",
              name: "",
              opacity: 1,
              visible: true,
              selectable: true,
              removable: true,
              alwaysOnTop: false,
              showInExport: true,
              x: -3.2862601528904634e-14,
              y: 123.262245356992,
              width: 597.0092231817092,
              height: 2.006753691367091,
              rotation: 0,
              animations: [],
              blurEnabled: false,
              blurRadius: 10,
              brightnessEnabled: false,
              brightness: 0,
              sepiaEnabled: false,
              grayscaleEnabled: false,
              shadowEnabled: false,
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "black",
              shadowOpacity: 1,
              draggable: true,
              resizable: true,
              contentEditable: true,
              styleEditable: true,
              color: "black",
              dash: [4, 1],
              startHead: "",
              endHead: "",
            },
          ],
        },
      ],
      width: 595.2755905511812,
      height: 841.8897637795276,
      background: "white",
      bleed: 0,
      duration: 5000,
    },
  ],
  audios: [],
  unit: "cm",
  dpi: 72,
};

export default function Page({
  params: { eventId, badgeAlias },
}: {
  params: {
    eventId: string;
    badgeAlias: string;
  };
}) {
  console.log(eventId, badgeAlias, "eventId");
  const badgeDivRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathName = usePathname() || "/";
  const [badgeJSON, setJson] = useState<Record<string, any>>(DEFAULT_JSON);
  const [title, setTitle] = useState<string>("untitled");
  const [settings, setSettings] = useState<TBadgeSettings>({
    canReceive: {
      eventAttendees: true,
      quizParticipants: true,
      sessionAttendees: true,
      trackAttendees: true,
      exceptions: [],
    },
  });

  const { badge, isLoading: badgeIsLoading } = useGetBadge({
    badgeId: badgeAlias,
    isAlias: true,
  });

  console.log(badge, badgeAlias, "badge");

  const { saveBadge, isLoading } = useSaveBadge();

  const [pending, startTransition] = useTransition();

  const onSubmit = async (store: StoreType) => {
    startTransition(async () => {
      try {
        const blob = (await store.toBlob()) as Blob;
        const json = store.toJSON();
        const snapshot = new File([blob], title, { type: "image/svg" });
        const { url: previewUrl, error } = await uploadFile(snapshot, "image");
        if (error || !previewUrl) throw error;
        const newBadge = await saveBadge({
          payload: {
            ...badge,
            settings,
            title,
            previewUrl,
            eventAlias: eventId,
            lastEdited: new Date(),
            badgeHash: json,
          },
        });

        if (newBadge) {
          setTitle(newBadge.title);
          setSettings(newBadge.settings);
          setJson(newBadge.badgeHash);
          router.push(`${pathName}?badgeAlias=${newBadge.badgeAlias}`);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    if (badgeIsLoading) return;

    if (badge) {
      setTitle(badge.title);
      setSettings(badge.settings);
      setJson(badge.badgeHash);
    }
  }, [badge]);

  useLayoutEffect(() => {
    const badgeDiv = badgeDivRef.current;

    if (!badgeDiv) return;
    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - badgeDiv.offsetTop;

    // Set the maximum height of the div
    badgeDiv.style.height = `${distanceToBottom}px`;
  }, []);

  return (
    <div ref={badgeDivRef}>
      {!badgeIsLoading ? (
        <>
          <section className="border-b flex justify-between px-4 py-2">
            <Button
              className="flex gap-2"
              variant={"ghost"}
              onClick={() => router.push("../badge")}
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
              value={title}
              onInput={(e) => setTitle(e.currentTarget.value)}
            />
            <BadgeSettings
              settings={settings}
              setSettings={setSettings}
              eventId={eventId}
            />
          </section>
          <Editor
            json={badgeJSON}
            onSave={onSubmit}
            isLoading={isLoading || pending}
          />
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
  );
}

const BadgeSettings = ({
  settings,
  setSettings,
  eventId,
}: {
  settings: TBadgeSettings;
  setSettings: React.Dispatch<SetStateAction<TBadgeSettings>>;
  eventId: string;
}) => {
  const { attendees, isLoading } = useGetAttendees({ eventId });

  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>(
    settings.canReceive.exceptions
      ? attendees.filter(
          ({ id }) => id && settings.canReceive.exceptions?.includes(id)
        )
      : []
  );
  const [hasExceptions, setHasExceptions] = useState(false);

  type ValueType = TAttendee | TAttendee[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
      ? selectedAttendees.filter((item) => item !== value)
      : [...selectedAttendees, value];

    setSettings((prev) => ({
      ...prev,
      canReceive: {
        ...prev.canReceive,
        exceptions: updatedValue.map(({ id }) => id || 0),
      },
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-basePrimary">
          <span>Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-2 pt-6 z-[100] overflow-auto no-scrollbar">
        <DialogHeader className="px-3">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="pb-2 pt-4">
          <h4 className="text-gray-700 font-medium">
            Who should receive this certificate?
          </h4>
          <div className="space-y-4 text-sm font-medium text-gray-500 pt-2 pb-4">
            <div className="flex justify-between">
              <span>Event Attendees</span>
              <Switch
                className="data-[state=checked]:bg-basePrimary"
                checked={settings.canReceive.eventAttendees}
                onCheckedChange={(status) =>
                  setSettings((prev) => ({
                    ...prev,
                    canReceive: {
                      ...prev.canReceive,
                      eventAttendees: status,
                    },
                  }))
                }
              />
            </div>
            {settings.canReceive.eventAttendees && (
              <>
                <div className="flex justify-between">
                  <span>Exceptions</span>
                  <Switch
                    className="data-[state=checked]:bg-basePrimary"
                    checked={hasExceptions}
                    onCheckedChange={(status) => setHasExceptions(status)}
                  />
                </div>
                {hasExceptions && (
                  <ViewAttendeesSection
                    attendees={attendees}
                    selectedAttendees={selectedAttendees}
                    toggleValue={toggleValue}
                  />
                )}
              </>
            )}
            <div className="flex justify-between">
              <span>Track Attendees</span>
              <Switch
                className="data-[state=checked]:bg-basePrimary"
                checked={settings.canReceive.trackAttendees}
                onCheckedChange={(status: boolean) =>
                  setSettings((prev) => ({
                    ...prev,
                    canReceive: {
                      ...prev.canReceive,
                      trackAttendees: status,
                    },
                  }))
                }
              />
            </div>
            <div className="flex justify-between">
              <span>Session Attendees</span>
              <Switch
                className="data-[state=checked]:bg-basePrimary"
                checked={settings.canReceive.sessionAttendees}
                onCheckedChange={(status: boolean) =>
                  setSettings((prev) => ({
                    ...prev,
                    canReceive: {
                      ...prev.canReceive,
                      sessionAttendees: status,
                    },
                  }))
                }
              />
            </div>
            <div className="flex justify-between">
              <span>Quiz Participants</span>
              <Switch
                className="data-[state=checked]:bg-basePrimary"
                checked={settings.canReceive.quizParticipants}
                onCheckedChange={(status) =>
                  setSettings((prev) => ({
                    ...prev,
                    canReceive: {
                      ...prev.canReceive,
                      quizParticipants: status,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-basePrimary w-full">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
