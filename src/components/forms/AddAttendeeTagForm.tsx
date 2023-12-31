import {
  useGetAttendeetags,
  useGetTags,
  useUpdateAttendeetags,
} from "@/hooks/tags";
import { TAttendeeTags, TTag } from "@/types/tags";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AddTagForm from "./AddTagForm";

export default function AddAttendeeTagForm({
  attendeeEmail,
  attendeeId,
}: {
  attendeeEmail: string;
  attendeeId: number;
}) {
  const [selectedTags, setSelectedTags] = useState<TTag[]>([]);
  const {
    tags,
    isLoading: tagsIsLoading,
    error,
    getTags,
  } = useGetTags({
    email: "ubahyusuf484@gmail.com",
  });
  const {
    attendeeTags,
    isLoading: attendeeTagsisLoading,
    // error,
  } = useGetAttendeetags({ attendeeId });

  const { updateAttendeetags, isLoading: updatetagsIsLoading } =
    useUpdateAttendeetags({
      attendeeId,
    });

  async function onSubmit(data: TTag[]) {
    const payload: TAttendeeTags = attendeeTags
      ? {
          ...attendeeTags,
          contactAttendeeTags: [...attendeeTags.contactAttendeeTags, ...data],
        }
      : {
          email: "ubahyusuf484@gmail.com",
          contactAttendeeEmail: attendeeEmail,
          eventId: 1234567890,
          attendeeId,
          contactAttendeeId: 10,
          contactAttendeeTags: data,
        };

    await updateAttendeetags({ payload });
    getTags();
  }

  useEffect(() => {
    console.log(attendeeTags);
  }, [attendeeTags]);

  const toggleTags = (tag: TTag) => {
    console.log(selectedTags.includes(tag));
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((item) => item !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="space-y-6">
      <AddTagForm currentTags={tags} getTags={getTags} />
      <div className="space-y-2">
        <h4 className="text-gray-800 font-medium">Your Tags</h4>
        <div className="flex flex-wrap gap-2">
          {!tagsIsLoading && !attendeeTagsisLoading ? (
            <>
              {tags?.tags ? (
                <>
                  {tags.tags
                    .filter(
                      (tag) =>
                        !attendeeTags ||
                        !attendeeTags?.contactAttendeeTags.includes(tag)
                    )
                    .map((tag) => (
                      <button
                        className="text-sm flex items-center gap-1.5 p-2 rounded w-fit"
                        style={{
                          backgroundColor: tag.color + "22",
                          color: tag.color,
                          borderWidth: "2px",
                          borderColor: selectedTags.includes(tag)
                            ? tag.color
                            : tag.color + "22",
                        }}
                        onClick={() => toggleTags(tag)}
                      >
                        <span className="font-medium capitalize">
                          {tag.label}
                        </span>
                      </button>
                    ))}
                </>
              ) : (
                <span>No tags created</span>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <Button
        disabled={selectedTags.length === 0}
        onClick={onSubmit}
        className="bg-basePrimary w-full"
      >
        Create Tag
      </Button>
    </div>
  );
}
