import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateTags } from "@/hooks/services/tags";
import { TTag, TTags } from "@/types/tags";
import COLORTAG from "@/utils/colorTag";
import { useState } from "react";

export default function AddTagForm({
  currentTags,
  getTags,
}: {
  currentTags: TTags;
  getTags: () => void;
}) {
  console.log(currentTags, "tag");
  const [label, setLabel] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const { updateTags, isLoading, error } = useUpdateTags({
    userId: 10,
  });

  async function onSubmit(data: TTag) {
    const payload: TTags = currentTags
      ? {
          ...currentTags,
          tags: [...currentTags.tags, { label, color }],
        }
      : { id: 10, userEmail: "ubahyusuf484@gmail.com", tags: [{ label, color }] };

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
          onInput={(e) => setLabel(e.target.value)}
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
        onClick={onSubmit}
        className="bg-basePrimary w-full"
      >
        Create New Tag
      </Button>
    </div>
  );
}
