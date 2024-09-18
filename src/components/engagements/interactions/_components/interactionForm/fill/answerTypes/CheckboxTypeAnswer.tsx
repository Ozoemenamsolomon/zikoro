import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
export function CheckboxTypeAnswer({
  form,
  index
}: {
  form: UseFormReturn<any, any, any>;
  index: number;
}) {
  return (
    <div className="w-full bg-white border grid grid-cols-1 gap-4 h-fit rounded-lg p-4">
      <div className="w-full p-2 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end">
        <p className="w-full text-start leading-7">Question</p>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-y-4">
        {["Option 1", "Optiion 3", "Option 2"].map((value) => (
          <FormField
            key={value}
            control={form.control}
            name="option"
            render={({ field }) => (
              <label className="flex items-center">
                <input
                  type="radio"
                  {...field}
                  value={value}
                  className="h-[20px] pt-3 w-[20px] mr-4 accent-basePrimary"
                />
                <span className="capitalize">{value}</span>
              </label>
            )}
          />
        ))}
      </div>
    </div>
  );
}
