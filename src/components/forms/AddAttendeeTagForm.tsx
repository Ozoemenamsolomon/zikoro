import {
  useGetAttendeetags,
  useGetTags,
  useUpdateAttendeetags,
  useUpdateTags,
} from "@/hooks/services/tags";
import { TAttendeeTags, TTag, TTags } from "@/types/tags";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AddTagForm from "./AddTagForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    // error,
    getTags,
  } = useGetTags({
    userId: 10,
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

  const { updateTags, isLoading, error } = useUpdateTags({
    userId: 10,
  });

  async function onSubmit() {
    const payload: TAttendeeTags = attendeeTags
      ? {
          ...attendeeTags,
          attendeeTags: [...attendeeTags.attendeeTags, ...selectedTags],
        }
      : {
          userEmail: "ubahyusuf484@gmail.com",
          attendeeEmail: attendeeEmail,
          eventId: 1234567890,
          attendeeId,
          userId: 10,
          attendeeTags: selectedTags,
        };

    console.log(payload, "on the front side");
    await updateAttendeetags({ payload });
    getTags();
  }

  async function removeTag(tag: TTag) {
    const payload: TTags = {
      ...tags,
      tags: tags.tags.filter((prevTag) => prevTag !== tag),
    };

    await updateTags({ payload });
    await getTags();
  }

  useEffect(() => {
    console.log(attendeeTags, tags, "attendee tags");
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
      <AddTagForm tags={tags} getTags={getTags} />
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
                        !attendeeTags?.attendeeTags.find(
                          (elm) => tag.label === elm.label
                        )
                    )
                    .map((tag) => (
                      <button
                        className="relative text-sm flex items-center gap-1.5 p-2 rounded w-fit"
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
                        <Dialog>
                          <DialogTrigger>
                            <button
                              style={{
                                backgroundColor: tag.color + "55",
                                color: tag.color,
                              }}
                              className="bg-white h-4 w-4 flex items-center justify-center text-[8px] absolute -right-2 -top-2 rounded-full"
                            >
                              x
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you sure you want to delete this tag?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete the tag and it will be
                                removed from all assigned attendees.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    removeTag(tag);
                                  }}
                                >
                                  Confirm
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
      <DialogClose asChild>
        <Button
          disabled={selectedTags.length === 0}
          onClick={onSubmit}
          className="bg-basePrimary w-full"
        >
          Add Tags
        </Button>
      </DialogClose>
    </div>
  );
}
