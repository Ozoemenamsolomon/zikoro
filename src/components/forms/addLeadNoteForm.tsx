"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "../ui/dialog";
import { ILead } from "@/types";
import { useMutateData } from "@/hooks/services/request";
import { Textarea } from "../ui/textarea";

export default function AddLeadNoteForm({
  lead,
  getLeads,
  updateSelectedLead,
}: {
  lead: ILead;
  getLeads: () => Promise<void>;
  updateSelectedLead: () => Promise<void>;
}) {
    console.log(lead.notes)
  const { mutateData, isLoading } = useMutateData<Partial<ILead>>(
    `/leads/${lead.id}`
  );
  const [note, setNote] = useState<string>(lead.notes);

  async function onSubmit() {
    await mutateData({ payload: { notes: note } });
    await getLeads();
    await updateSelectedLead();
  }

  return (
    <div className="space-y-4">
      <div className="w-full rounded-md bg-background text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Note
        </span>
        <Textarea
          defaultValue={note}
          onChange={(e) => setNote(e.currentTarget.value)}
          placeholder="Write a note"
        />
      </div>
      <DialogClose asChild>
        <Button
          type="submit"
          disabled={!note || note === lead.notes}
          className="bg-basePrimary w-full"
          onClick={onSubmit}
        >
          {lead.notes ? "edit" : "add"} note
        </Button>
      </DialogClose>
    </div>
  );
}
