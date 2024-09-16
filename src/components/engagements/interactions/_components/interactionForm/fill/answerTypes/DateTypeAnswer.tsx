import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoMdStar } from "react-icons/io";
export function DateTypeAnswer({
  form,
}: {
  form: UseFormReturn<any, any, any>;
}) {
  return (
    <div className="w-full bg-white border grid grid-cols-1 gap-4 h-fit rounded-lg p-3">
      <div className="w-full p-2 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end">
        <p className="w-full text-start leading-7 flex ">Question <IoMdStar size={12} className="text-red-700"/></p>
      </div>

      <FormField
        control={form.control}
        name={`answer`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                {...form.register("answer")}
                className="w-full h-12 sm:h-14 border-x-0 border-t-0 border-b px-2 placeholder:text-gray-500 placeholder-gray-500"
                placeholder="Enter Answer"
                type="date"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
