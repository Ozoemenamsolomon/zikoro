import Image from "next/image";
import { MdClose } from "react-icons/md";
import {Button} from "@/components"
import { UseFormReturn } from "react-hook-form";
import {z} from "zod"
import { formQuestionSchema } from "@/schemas/engagement";
export function SelectedImage({form,index, image }: { form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>; index: number; image: string }) {

    function handleRenoveImage () {
        form.setValue(`questions.${index}.questionImage`, undefined)
    }
    return (
        <div className="w-full col-span-full rounded-lg p-4 xl:p-6 bg-white border-[8px] border-[#001ffc]/10 ">
            <div className="mx-auto w-full max-w-2xl relative h-[20rem] 2xl:h-[25rem] ">
                <Image src={image} alt="selected image" width={1000} height={600} className="object-cover h-full w-full" />
                <Button
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    handleRenoveImage()
                }}
                className="absolute px-0 top-[-1rem] h-10 w-10 rounded-full bg-[#001FCC19] right-[-0.4rem]">
                    <MdClose size={24} />
                </Button>
            </div>
        </div>
    )
}