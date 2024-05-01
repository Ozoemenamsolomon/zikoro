"use client";

import { Button } from "@/components";
import { AddPartners } from "@/components/partners/_components";
import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
import { useState } from "react";
import { TPartner } from "@/types";

export function Edit({
  partner,
  refetch,
}: {
  partner: TPartner | null;
  refetch: () => Promise<any>;
}) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

  return (
    <>
      <Button onClick={onClose}>
        <EditOutline size={22} />
      </Button>

      {isOpen && partner && (
        <AddPartners
          eventId={partner?.eventAlias}
          close={onClose}
          partner={partner}
          refetchPartners={refetch}
        />
      )}
    </>
  );
}
