"use client";

import { Button } from "@/components";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { TAgenda } from "@/types";
import { useCreateAgenda } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { generateAlias } from "@/utils";

export function Duplicate({ session, refetch }: {refetch?: ()=> Promise<any>; session: Partial<TAgenda> }) {
  const { createAgenda, isLoading } = useCreateAgenda();

  async function update() {
    const { id, sessionAlias: alias, ...restData } = session;
    const sessionAlias = generateAlias()
    await createAgenda({ payload: {...restData, sessionAlias }});
   if (refetch) refetch()
  }
  return (
    <>
      <Button
       disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          update();
        }}
        className="h-fit gap-x-2 w-fit px-0"
      >
        <Copy size={20} />
        {isLoading && <LoaderAlt size={10} className="animate-spin" />}
      </Button>
    </>
  );
}
