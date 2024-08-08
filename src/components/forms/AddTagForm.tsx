import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/hooks";
import { useUpdateTags } from "@/hooks/services/tags";
import useUserStore from "@/store/globalUserStore";
import { TUser } from "@/types";
import { TTag, TTags } from "@/types/tags";
import COLORTAG from "@/utils/colorTag";
import { useState } from "react";

export default function AddTagForm({
  currentTags,
  getTags,
}: {
  currentTags: TTags | null;
  getTags: () => void;
}) {
  
  const [label, setLabel] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const { user, setUser } = useUserStore();

  const { updateTags, isLoading, error } = useUpdateTags({
    userId: user ? user.id : 0,
  });

  async function onSubmit() {
    if (!user) return;
    const payload: TTags = currentTags
      ? {
          ...currentTags,
          tags: [...(currentTags.tags ?? []), { label, color }],
        }
      : {
          userId: user.id,
          userEmail: user?.userEmail,
          tags: [{ label, color }],
        };

    

    await updateTags({ payload });
    await getTags();
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Tag
        </label>
        <Input
          placeholder="create new tag"
          value={label}
          onInput={(e) => setLabel(e.currentTarget.value)}
          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {COLORTAG.map((colorValue) => (
          <button
            className={`
              h-8 w-8 rounded-full
              ${color === colorValue ? "opacity-100" : "opacity-25"}
              `}
            style={{ backgroundColor: colorValue }}
            key={colorValue}
            onClick={() => setColor(colorValue)}
          />
        ))}
      </div>
      <Button
        disabled={!label || !color}
        onClick={() => onSubmit()}
        className="bg-basePrimary w-full"
      >
        Create New Tag
      </Button>
    </div>
  );
}
