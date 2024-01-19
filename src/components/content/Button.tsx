export const Button = ({
  children,
  form,
  type,
  text,
  containerClassName,
  spanClassName,
  onClick,
}: {
  children?: React.ReactNode;
  form?: string;
  type: "submit" | "button" | "reset";
  text: string;
  containerClassName?: string;
  spanClassName?: string;
  onClick?: () => void;
}) => {
  return (
    <>
      <button
        className={`${containerClassName} text-sm flex justify-center items-center py-[10px] px-[16px] rounded-[5px]`}
        type={type}
        id={form}
        onClick={onClick}
      >
        <span className={spanClassName}>{text}</span>
        {children}
      </button>
    </>
  );
};
