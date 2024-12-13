import { InlineIcon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/custom_ui/Button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import Avatar, { genConfig, AvatarFullConfig } from "react-nice-avatar";
import { Plus } from "styled-icons/bootstrap";
import { AvatarModal } from "../../../presentation/attendee/AvatarModal";
import toast from "react-hot-toast";
import { generateAlias } from "@/utils";
import { UserDetail } from "../EventQaAttendeeView";

export function JoinQA({ joined, addUser }: {addUser:(user: UserDetail) => void; joined: () => void }) {
  const router = useRouter();
  const [attendeeDetail, setAttendeeDetail] = useState("");
  const [isAvatarModal, setAvatarModal] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const [chosenAvatar, setChosenAvatar] =
    useState<Required<AvatarFullConfig> | null>(null);

  function toggleAvatarModal() {
    setAvatarModal((prev) => !prev);
  }
  function toggleIsAvatar() {
    setIsAvatar((prev) => !prev);
  }

  function generateAvatars() {
    const avatars = Array.from({ length: 10 }).map((_, index) => {
      return {
        avatar: genConfig(),
      };
    });

    return avatars;
  }

  const avatars = useMemo(() => {
    return generateAvatars();
  }, [isAvatar]);

  async function submit(e: any) {
    e.preventDefault();
    if (!attendeeDetail) {
      toast.error("Pls add a nickName");
      return;
    }
    if (chosenAvatar === null) {
      toast.error("Pls select an avatar");
      return;
    }
    const userId = generateAlias();
    const userDetail: UserDetail = {
      userId,
      userNickName:attendeeDetail,
      userImage:chosenAvatar
    }
    addUser(userDetail)
    joined();
  }
  return (
    <>
      <div className="w-full h-full inset-0 fixed bg-[#F9FAFF]">
        <div className="w-[95%] max-w-xl rounded-lg absolute h-fit flex flex-col items-start justify-start gap-8 bg-white border p-4 sm:p-6 m-auto inset-0">
          <button
            onClick={() => router.back()}
            className="flex mb-3 items-center gap-x-1 text-mobile sm:text-sm"
          >
            <InlineIcon
              fontSize={20}
              icon="material-symbols-light:arrow-back"
            />
            <p>Go Back</p>
          </button>
          <form 
          onSubmit={submit}
          className="w-full flex flex-col items-center justify-center gap-6">
            <h2 className="font-semibold text-2xl text-center sm:text-3xl">
              Event Q & A
            </h2>

            <div className="w-full flex items-end gap-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleAvatarModal();
                }}
                className="text-white rounded-full h-20 w-20 flex items-center justify-center bg-black/50 flex-col"
              >
                {chosenAvatar ? (
                  <Avatar
                    className="h-20 w-20 rounded-full"
                    {...chosenAvatar}
                  />
                ) : (
                  <>
                    <Plus size={24} />
                    <p className="text-xs font-medium">Avatar</p>
                  </>
                )}
              </button>
              <div className="w-[70%] max-w-[26em] space-y-2">
                <Input
                  value={attendeeDetail}
                  onChange={(e) => {
                    setAttendeeDetail(e.target.value);
                  }}
                  className="border-0 border-b rounded-none w-full"
                  placeholder="Enter Name"
                  type="text"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-basePrimary w-[110px] text-white font-medium "
            >
              Let's Go
            </Button>
          </form>
        </div>
      </div>
      {isAvatarModal && (
        <AvatarModal
          close={toggleAvatarModal}
          chosenAvatar={chosenAvatar}
          setChosenAvatar={setChosenAvatar}
          toggleIsAvatar={toggleIsAvatar}
          avatars={avatars}
        />
      )}
    </>
  );
}
