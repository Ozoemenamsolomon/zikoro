import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoMdStar } from "react-icons/io";


type OptionItemsType = {
  id: string;
  option: string;
  optionImage: string;
};

export function CheckboxTypeAnswer({
  form,
  index,
}: {
  form: UseFormReturn<any, any, any>;
  index: number;
}) {
  const question = form.watch(`questions.${index}.question`);
  const isRequired = form.watch(`questions.${index}.isRequired`);
  const optionFields = form.watch(`questions.${index}.optionFields`);
  return (
    <div className="w-full bg-white border grid grid-cols-1 gap-4 h-fit rounded-lg p-4">
      <div className="w-full p-2 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end">
        <p className="w-full text-start leading-7 flex ">
          {question ?? ""}{" "}
          {isRequired && <IoMdStar size={12} className="text-red-700" />}
        </p>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-y-4">
        {Array.isArray(optionFields) && optionFields.map((value) => (
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
