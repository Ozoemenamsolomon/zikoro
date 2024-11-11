import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectCertificateModal from "@/components/selectCertificateModal";

export default function AttendeeCredentials(props) {
  console.log(props);
  
  return (
    <section className="flex justify-between items-center border-y-[1px] border-gray-200 p-2">
      <h3 className="text-lg text-greyBlack font-semibold">Credentials</h3>
      {!props.attendeeCertificatesIsLoading ? (
        props.attendeeCertificates.length > 0 &&
        props.user &&
        String(props.event?.createdBy) === String(props.user.id) && (
          <Dialog>
            <DialogTrigger>
              <span className="  text-sm text-[#001FCC] ">
                Recall certificate
              </span>
            </DialogTrigger>
            <DialogContent className="px-3">
              <DialogHeader>
                <DialogTitle>
                  <span className="capitalize">Select Certificate</span>
                </DialogTitle>
              </DialogHeader>
              <SelectCertificateModal
                certificates={props.attendeeCertificates}
                action={"recall"}
                attendeeId={props.id}
                getAttendeeCertificates={props.getAttendeeCertificates}
              />
            </DialogContent>
          </Dialog>
        )
      ) : (
        <p className="px-2 text-sm font-medium text-gray-500">Loading...</p>
      )}
    </section>
  );
}
