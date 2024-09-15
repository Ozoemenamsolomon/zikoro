"use client"
import { formQuestionSchema } from "@/schemas/engagement";
import { UseFormReturn } from "react-hook-form"
import {z} from "zod"
import Image from "next/image"
import {useMemo, useState} from "react"
import { cn } from "@/lib";

export function AddCoverImage({form}: {form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>, }) {
    const [isDragOver, setIsDragOver] = useState(false);
   
  
    function dragOverHandler(event: React.DragEvent<HTMLLabelElement>) {
      //prevent browser default drag behavior, and prevent file from opening
      event.preventDefault();
    }

    function dropHandler(ev: React.DragEvent<HTMLLabelElement>) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    
        setIsDragOver(false); // remove the drag color effect after dropping
    
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          const itemsArray = Array.from(ev.dataTransfer.items);
          itemsArray.forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
              const file = item.getAsFile()!;
              form.setValue("coverImage", file)
         
            }
          });
        } else {
          // Use DataTransfer interface to access the file(s)
          const itemsArray = Array.from(ev.dataTransfer.items);
          itemsArray.forEach((item: any, i) => {
            //////console.log({file});
            const file = item.getAsFile()!;
            form.setValue("coverImage", file)
          
          });
        }
      }
    const watchedImage = form.watch("coverImage");

    const image = useMemo(() => {
      if (typeof watchedImage === "string") {
        return watchedImage;
      } else if (watchedImage && watchedImage[0] && watchedImage instanceof FileList) {
        return URL.createObjectURL(watchedImage[0]);
      }
      else if (watchedImage && watchedImage instanceof File) {
        return URL.createObjectURL(watchedImage)
      }
      else {
        return null
      }
    }, [watchedImage]);
  
   
    return (
        <label
        onDrop={(e) => {
            dropHandler(e);
          }}
          onDragEnter={() => {
            setIsDragOver(true);
          }}
          onDragOver={(event) => {
            setIsDragOver(true);
            dragOverHandler(event);
          }}
          onDragLeave={() => {
            setIsDragOver(false);
          }}
        htmlFor="form-image"
        className={cn("w-full gap-y-2 bg-gradient-to-tr h-[10rem] flex flex-col items-center justify-center relative sm:h-[15rem] border 2xl:h-[20rem] from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg", isDragOver && " border-red-500")}
      >
        <input
          type="file"
          {...form.register("coverImage")}
          accept="image/*"
          id="form-image"
          hidden
          className="w-full h-full inset-0 absolute z-40"
        />

        {image ? (
        <div className="w-full relative">
            <Image
            src={image}
            alt="cover-image"
            width={2000}
            height={600}
            className="w-full h-[10rem] sm:h-[15rem] border 2xl:h-[20rem] object-cover  rounded-lg"
          />
        </div>
        ) : (
          <div className="w-[230px] flex flex-col items-center justify-center gap-y-3">
            <p className="text-gray-500">
              Drag and drop cover image here
            </p>
            <div className="w-[90%] flex items-center gap-x-2">
              <span className="h-[1px] w-[46%] bg-gray-500"></span>
              <p>or</p>
              <span className="h-[1px] w-[46%] bg-gray-500"></span>
            </div>
            <button className="text-basePrimary underline">
              Click to Upload
            </button>
          </div>
        )}
      </label>
    )
}