import Select from "react-select";
import {
  UseControllerProps,
  UseControllerReturn,
  useController,
  FieldValues,
} from "react-hook-form";

function ErrorText({ children }: { children?: string }) {
  return (
    <div>
      {children && <p className="pt-1 text-xs text-red-500 ">{children}</p>}
    </div>
  );
}

export const ReactSelect = <T extends FieldValues>(
  prop: UseControllerProps<T> & {
    options: { value: string; label: string }[];
    error?: string;
    label?: string;
    placeHolder: string;
  }
) => {
  const { label, options, error, placeHolder, ...controllerProps } = prop;
  const {
    field: { onChange },
  } = useController(controllerProps) as UseControllerReturn<T>;

  return (
    <div className="w-full relative h-[48px]">
      <label
        className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1"
        htmlFor="select"
      >
        {label}
      </label>

      <Select
        placeholder={placeHolder}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state?.isFocused ? "#6b7280" : "#e5e7eb",
            "&:hover": {
                borderColor: "#6b7280",
              },
            height: "48px",
            backgroundColor: "#ffffff",
            boxShadow:"0px"
          }),
        
          option: (baseStyles, state) => ({
            ...baseStyles,
            textAlign: "start",
            color: state?.isSelected ? "black" : "black",
            backgroundColor: state?.isFocused ? "#e2e8f0" : "",
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            textAlign: "start",
            textDecoration:"capitalize"
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            textAlign: "start",
            color: "#e5e7eb",
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "6px",
            zIndex:100
          }),
        }}
        options={options}
        onChange={(newValue) => onChange(newValue?.value)}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
};
