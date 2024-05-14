import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddAttendeeTagForm from "../forms/AddAttendeeTagForm";

export default function AttendeeTagsSection(props) {
  return (
    <section className="border-t-[1px] border-gray-200 pt-2 space-y-4">
      <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 px-2">
        <h4 className="text-lg font-medium text-greyBlack ">Tags</h4>
        <Dialog>
          <DialogTrigger>
            <button className="flex gap-1">
              <span className="text-sm text-[#15161B] font-medium">Tag</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M8.78345 10.8332V13.3332C8.78345 13.5693 8.86345 13.7673 9.02345 13.9273C9.18345 14.0873 9.38122 14.1671 9.61678 14.1665C9.85289 14.1665 10.0509 14.0865 10.2109 13.9265C10.3709 13.7665 10.4507 13.5687 10.4501 13.3332V10.8332H12.9501C13.1862 10.8332 13.3843 10.7532 13.5443 10.5932C13.7043 10.4332 13.784 10.2354 13.7834 9.99984C13.7834 9.76373 13.7034 9.56567 13.5434 9.40567C13.3834 9.24567 13.1857 9.16595 12.9501 9.1665H10.4501V6.6665C10.4501 6.43039 10.3701 6.23234 10.2101 6.07234C10.0501 5.91234 9.85234 5.83261 9.61678 5.83317C9.38067 5.83317 9.18261 5.91317 9.02261 6.07317C8.86261 6.23317 8.78289 6.43095 8.78345 6.6665V9.1665H6.28345C6.04734 9.1665 5.84928 9.2465 5.68928 9.4065C5.52928 9.5665 5.44956 9.76428 5.45011 9.99984C5.45011 10.2359 5.53011 10.434 5.69011 10.594C5.85011 10.754 6.04789 10.8337 6.28345 10.8332H8.78345ZM9.61678 18.3332C8.464 18.3332 7.38067 18.1143 6.36678 17.6765C5.35289 17.2387 4.47095 16.6451 3.72095 15.8957C2.97095 15.1457 2.37734 14.2637 1.94011 13.2498C1.50289 12.2359 1.284 11.1526 1.28345 9.99984C1.28345 8.84706 1.50234 7.76373 1.94011 6.74984C2.37789 5.73595 2.9715 4.854 3.72095 4.104C4.47095 3.354 5.35289 2.76039 6.36678 2.32317C7.38067 1.88595 8.464 1.66706 9.61678 1.6665C10.7696 1.6665 11.8529 1.88539 12.8668 2.32317C13.8807 2.76095 14.7626 3.35456 15.5126 4.104C16.2626 4.854 16.8565 5.73595 17.2943 6.74984C17.7321 7.76373 17.9507 8.84706 17.9501 9.99984C17.9501 11.1526 17.7312 12.2359 17.2934 13.2498C16.8557 14.2637 16.2621 15.1457 15.5126 15.8957C14.7626 16.6457 13.8807 17.2396 12.8668 17.6773C11.8529 18.1151 10.7696 18.3337 9.61678 18.3332ZM9.61678 16.6665C11.4779 16.6665 13.0543 16.0207 14.3459 14.729C15.6376 13.4373 16.2834 11.8609 16.2834 9.99984C16.2834 8.13873 15.6376 6.56234 14.3459 5.27067C13.0543 3.979 11.4779 3.33317 9.61678 3.33317C7.75567 3.33317 6.17928 3.979 4.88761 5.27067C3.59595 6.56234 2.95011 8.13873 2.95011 9.99984C2.95011 11.8609 3.59595 13.4373 4.88761 14.729C6.17928 16.0207 7.75567 16.6665 9.61678 16.6665Z"
                  fill="#15161B"
                />
              </svg>
            </button>
          </DialogTrigger>
          <DialogContent className="px-3">
            <DialogHeader>
              <DialogTitle>
                <span className="capitalize">Add Tags</span>
              </DialogTitle>
            </DialogHeader>
            <AddAttendeeTagForm
              attendeeEmail={props.attendee?.email}
              attendeeId={props.attendee?.id}
              getAttendeeTags={props.getAttendeeTags}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-2 flex-wrap px-2 py-2">
        {!props.attendeeTagsisLoading ? (
          <>
            {props.attendeeTags?.attendeeTags &&
            props.attendeeTags?.attendeeTags?.length > 0 ? (
              <>
                {props.attendeeTags?.attendeeTags.map((tag) => (
                  <div
                    className="relative text-sm flex items-center gap-1.5 p-2 rounded w-fit font-medium"
                    style={{
                      backgroundColor: tag.color + "33",
                      color: tag.color,
                    }}
                  >
                    <button
                      onClick={() => props.removeAttendeeTag(tag)}
                      style={{
                        backgroundColor: tag.color + "55",
                        color: tag.color,
                      }}
                      className="bg-white h-4 w-4 flex items-center justify-center text-[8px] absolute -right-2 -top-2 rounded-full"
                    >
                      x
                    </button>
                    <span>{tag.label}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="px-2 text-sm font-medium text-gray-500">
                No tags for this attendee
              </p>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
  );
}
