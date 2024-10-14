import { InlineIcon } from "@iconify/react";
import { useState } from "react";

export function NumberSelectorWidget({
  name,
  value,
}: {
  value: number;
  name: string;
}) {
  const [newValue, setNewValue] = useState(value);

  return (
    <div className="w-[100px] h-12 flex items-center justify-between rounded-md p-2 border">
      <input
        type="number"
        readOnly
        value={newValue}
        className="outline-none  border-0 text-xl"
      />
      <div className="flex flex-col items-center justify-center">
        <button onClick={() => setNewValue(value + 1)}>
          <InlineIcon icon="iconamoon:arrow-up-2-thin" fontSize={28} />
        </button>

        <button
          onClick={() => {
            if (value >= 1) {
              setNewValue(value - 1);
            }
          }}
        >
          <InlineIcon icon="simple-line-icons:arrow-down" fontSize={28} />
        </button>
      </div>
    </div>
  );
}
