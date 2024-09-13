import Image from "next/image";
import { MdClose } from "react-icons/md";
import {Button} from "@/components"
import { UseFormReturn } from "react-hook-form";
export function SelectedImage({form,name, image }: { form: UseFormReturn<any, any, any>; name: string; image: string }) {

    function handleRenoveImage () {
        form.setValue(name, "")
    }
    return (
        <div className="w-full rounded-lg p-4 xl:p-6 bg-white border-4 border-[#001ffc]/10 ">
            <div className="mx-auto w-full max-w-2xl relative h-[20rem] 2xl:h-[25rem] ">
                <Image src={image} alt="selected image" width={1000} height={600} className="object-cover " />
                <Button
                onClick={handleRenoveImage}
                className="absolute top-0 h-10 w-10 rounded-full bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end right-0">
                    <MdClose size={24} />
                </Button>
            </div>
        </div>
    )
}