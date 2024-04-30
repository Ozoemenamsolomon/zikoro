import {
  useGetAttendeeTags,
  useGetTags,
  useUpdateAttendeeTags,
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
import { getCookie } from "@/hooks";
import { TUser } from "@/types";
import { useParams } from "next/navigation";

export default function AddAttendeeTagForm({
  attendeeEmail,
  attendeeId,
}: {
  attendeeEmail: string;
  attendeeId: number;
}) {
  const user = getCookie<TUser>("user");
  const { eventId } = useParams();
  const [selectedTags, setSelectedTags] = useState<TTag[]>([]);
  const {
    tags,
    isLoading: tagsIsLoading,
    // error,
    getTags,
  } = useGetTags({
    userId: user ? user.id : 0,
  });

  const {
    attendeeTags,
    isLoading: attendeeTagsisLoading,
    // error,
  } = useGetAttendeeTags({ attendeeId });

  const { updateAttendeeTags, isLoading: updatetagsIsLoading } =
    useUpdateAttendeeTags({
      attendeeId,
    });

  const { updateTags, isLoading, error } = useUpdateTags({
    userId: user ? user.id : 0,
  });

  async function onSubmit() {
    if (!user) return;
    const payload: Partial<TAttendeeTags> = attendeeTags
      ? {
          ...attendeeTags,
          attendeeTags: [...attendeeTags.attendeeTags, ...selectedTags],
        }
      : {
          userEmail: user.userEmail,
          attendeeEmail: attendeeEmail,
          eventId: typeof eventId === "string" ? eventId : eventId[0],
          attendeeId,
          userId: user.id,
          attendeeTags: selectedTags,
        };

    console.log(payload, "on the front side");
    await updateAttendeeTags({ payload });
    await getTags();
  }

  async function removeTag(tag: TTag) {
    if (!tags) return;
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

  console.log(tags);

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
