import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
export function MultiChoiceTypeAnswer({
  form,
}: {
  form: UseFormReturn<any, any, any>;
}) {
  return (
    <div className="w-full bg-white border grid grid-cols-1 gap-4 h-fit rounded-lg p-4">
      <div className="w-full p-2 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end">
        <p className="w-full text-start leading-7">Question</p>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-y-4">
        {["Option 1", "Option 2", "Option 3"].map((value) => (
          <FormField
            key={value}
            control={form.control}
            name="options"
            render={({ field }) => (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...field}
                  value={value}
                  checked={field.value?.includes(value)}
                  onChange={(e) => {
                    const updatedValue = e.target.checked
                      ? [...(field.value || []), value]
                      : field.value?.filter((v: string) => v !== value);
                    field.onChange(updatedValue);
                  }}
                  className="h-[20px] w-[20px] mr-4 accent-basePrimary"
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
