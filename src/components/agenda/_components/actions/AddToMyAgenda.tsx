import { CalendarCheck } from "@styled-icons/bootstrap/CalendarCheck";
import { Button } from "@/components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useCreateMyAgenda } from "@/hooks";
export function AddToMyAgenda({
  attendeeId,
  sessionAlias
}: {
 
  sessionAlias: string;
  attendeeId?: number;
}) {
  const { createMyAgenda, isLoading } = useCreateMyAgenda();

  async function add() {
    await createMyAgenda({ payload: { sessionAlias, attendeeId } });
  }
  
  return (
    <>
      <Button
      disabled={isLoading}
      onClick={add} className="h-fit w-fit gap-x-2 px-0">
        <CalendarCheck className="text-basePrimary" size={20} />
        {isLoading && <LoaderAlt className="animate-spin" size={10} />}
      </Button>
    </>
  );
}
