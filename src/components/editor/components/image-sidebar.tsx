import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Loader, Upload } from "lucide-react";

import { ActiveTool, Editor } from "@/components/editor/types";
import { ToolSidebarClose } from "@/components/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/components/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { useGetOrganization, useUpdateOrganization } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { uploadFile } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  organizationId: string;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
  organizationId,
}: ImageSidebarProps) => {
  const {
    organization,
    isLoading: fetching,
    getOrganization,
  } = useGetOrganization({
    organizationId,
  });
  const { updateOrganization, isLoading: updating } = useUpdateOrganization({
    organizationId,
  });

  const [elementUploading, setElementUploading] = useState<boolean>(false);
  const uploadElement = async (file: File | null) => {
    console.log(file);
    try {
      if (!file) return;
      setElementUploading(true);
      const { url, error } = await uploadFile(file, "image");

      if (error || !url) throw error;
      // alert("File uploaded successfully");

      // setValue("element", url);
      const payload = organization?.certificateAsset
        ? {
            certificateAsset: {
              ...organization?.certificateAsset,
              elements: organization?.certificateAsset?.elements
                ? [...organization?.certificateAsset?.elements, url]
                : [url],
            },
          }
        : {
            certificateAsset: {
              elements: [url],
              backgrounds: [],
            },
          };

      // const payload = {
      //   certificateAsset: {
      //     elements: organization?.certificateAsset?.elements,
      //   },
      // };

      console.log(payload.certificateAsset.elements);

      await updateOrganization({
        payload,
      });

      await getOrganization();
    } catch (error) {
      alert("error uploading profile picture");
      console.error("Error uploading file:", error);
    } finally {
      setElementUploading(false);
    }
  };

  const divRef = useRef<HTMLDivElement>(null);

  const deleteElement = async (url: string) => {
    const payload = {
      certificateAsset: organization?.certificateAsset
        ? {
            ...organization?.certificateAsset,
            elements: organization?.certificateAsset.elements.filter(
              (item: string) => item !== url
            ),
          }
        : { elements: [], backgrounds: [] },
    };
    await updateOrganization({
      payload,
    });

    await getOrganization();
  };

  const Delete = ({ url }: { url: string }) => {
    const clsBtnRef = useRef<HTMLButtonElement>(null);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="absolute text-red-500 -top-1 -right-1 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                d="M17.004 20L17.003 8h-1-8-1v12H17.004zM13.003 10h2v8h-2V10zM9.003 10h2v8h-2V10zM9.003 4H15.003V6H9.003z"
              ></path>
              <path d="M5.003,20c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-3h-1V4c0-1.103-0.897-2-2-2h-6c-1.103,0-2,0.897-2,2v2h-1h-3 v2h2V20z M9.003,4h6v2h-6V4z M8.003,8h8h1l0.001,12H7.003V8H8.003z"></path>
              <path d="M9.003 10H11.003V18H9.003zM13.003 10H15.003V18H13.003z"></path>
            </svg>
          </button>
        </DialogTrigger>
        <DialogContent className="px-4 py-6 z-[1000]">
          <DialogHeader className="px-3">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 items-center py-4">
              <svg
                width={57}
                height={50}
                viewBox="0 0 57 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M55.6998 41.0225L33.8373 3.05501C33.2909 2.12482 32.511 1.35356 31.5748 0.817663C30.6385 0.281767 29.5785 -0.000152588 28.4998 -0.000152588C27.421 -0.000152588 26.361 0.281767 25.4247 0.817663C24.4885 1.35356 23.7086 2.12482 23.1623 3.05501L1.29975 41.0225C0.774092 41.9222 0.49707 42.9455 0.49707 43.9875C0.49707 45.0295 0.774092 46.0528 1.29975 46.9525C1.83908 47.8883 2.61768 48.6638 3.55566 49.1993C4.49363 49.7349 5.55721 50.0112 6.63725 50H50.3623C51.4414 50.0103 52.504 49.7336 53.441 49.1981C54.378 48.6626 55.1558 47.8876 55.6948 46.9525C56.2212 46.0532 56.4991 45.0302 56.4999 43.9882C56.5008 42.9462 56.2247 41.9227 55.6998 41.0225ZM52.2323 44.95C52.0417 45.2751 51.768 45.5437 51.4394 45.7282C51.1108 45.9127 50.7391 46.0065 50.3623 46H6.63725C6.26044 46.0065 5.88868 45.9127 5.56008 45.7282C5.23147 45.5437 4.95784 45.2751 4.76725 44.95C4.59461 44.6577 4.50355 44.3245 4.50355 43.985C4.50355 43.6455 4.59461 43.3123 4.76725 43.02L26.6298 5.05251C26.8242 4.72894 27.0991 4.4612 27.4276 4.27532C27.7562 4.08944 28.1273 3.99175 28.5048 3.99175C28.8822 3.99175 29.2533 4.08944 29.5819 4.27532C29.9104 4.4612 30.1853 4.72894 30.3798 5.05251L52.2423 43.02C52.4134 43.3132 52.5027 43.6469 52.501 43.9864C52.4992 44.3258 52.4064 44.6586 52.2323 44.95ZM26.4998 30V20C26.4998 19.4696 26.7105 18.9609 27.0855 18.5858C27.4606 18.2107 27.9693 18 28.4998 18C29.0302 18 29.5389 18.2107 29.914 18.5858C30.289 18.9609 30.4998 19.4696 30.4998 20V30C30.4998 30.5304 30.289 31.0392 29.914 31.4142C29.5389 31.7893 29.0302 32 28.4998 32C27.9693 32 27.4606 31.7893 27.0855 31.4142C26.7105 31.0392 26.4998 30.5304 26.4998 30ZM31.4998 39C31.4998 39.5934 31.3238 40.1734 30.9942 40.6667C30.6645 41.1601 30.196 41.5446 29.6478 41.7716C29.0996 41.9987 28.4964 42.0581 27.9145 41.9424C27.3325 41.8266 26.798 41.5409 26.3784 41.1213C25.9589 40.7018 25.6732 40.1672 25.5574 39.5853C25.4416 39.0033 25.5011 38.4001 25.7281 37.852C25.9552 37.3038 26.3397 36.8352 26.833 36.5056C27.3264 36.176 27.9064 36 28.4998 36C29.2954 36 30.0585 36.3161 30.6211 36.8787C31.1837 37.4413 31.4998 38.2044 31.4998 39Z"
                  fill="#001FCC"
                />
              </svg>
              <div className="text-gray-800 font-medium flex flex-col gap-2 text-center">
                <span>Are you sure you want to delete this element?</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  clsBtnRef.current?.click();
                }}
                className="border-2 bg-white border-basePrimary text-basePrimary w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  clsBtnRef.current?.click();
                  await deleteElement(url);
                }}
                className="bg-basePrimary w-full"
              >
                Delete
              </Button>
            </div>
          </div>

          <DialogClose asChild>
            <button className="hidden" ref={clsBtnRef}>
              close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Images"
        description="Add images to your credential"
      />
      <div className="flex flex-col gap-2 items-center py-4">
        {" "}
        <Button
          disabled={elementUploading}
          onClick={() => document.getElementById("image-input")?.click()}
          className="border-basePrimary border-2 text-basePrimary bg-transparent flex gap-4 justify-center items-center rounded-md py-2 px-3 hover:bg-basePrimary/20"
        >
          {elementUploading ? (
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
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1={12} y1={3} x2={12} y2={15} />
            </svg>
          )}
          <span>Import Element</span>
        </Button>
        <div className="hidden">
          <Input
            id="image-input"
            name="image"
            type="file"
            onChange={(e) => e.target.files && uploadElement(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <span className="text-gray-500 text-xs font-medium">
          Upload JPG and PNG not more than 2MB
        </span>
      </div>
      {fetching && (
        <div className="flex flex-1 items-center justify-center">
          <Loader className="size-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {/* {error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Failed to fetch images
            </p>
          </div>
        )} */}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {organization &&
              !!organization.certificateAsset?.elements &&
              organization.certificateAsset?.elements.map((image, index) => {
                return (
                  <button
                    key={image}
                    className="group relative h-[200px] w-full overflow-hidden rounded-sm border bg-muted transition"
                  >
                    <Delete url={image} />

                    <img
                      src={image}
                      alt={"Image " + index}
                      className="object-cover"
                    />
                    <button
                      onClick={() => {
                        editor?.addImage(image);
                      }}
                      className="absolute bottom-0 left-0 w-full truncate bg-black/50 p-1 text-center text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100"
                    >
                      Click here to add image
                    </button>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
