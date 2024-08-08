import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutateData } from "@/hooks/services/request";
import { ILead } from "@/types";

const ChangeLeadType = ({
  leadType,
  leadId,
  getLeads,
  updateSelectedLead,
}: {
  leadType: string;
  leadId: string;
  getLeads: () => Promise<void>;
  updateSelectedLead: () => Promise<void>;
}) => {
  const { mutateData, isLoading } = useMutateData<Partial<ILead>>(
    `/leads/${leadId}`
  );
  const [newLeadType, setNewLeadType] = useState<string>(leadType);

  return (
    <div className="space-y-4">
      <div className="w-full rounded-md bg-background text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Lead Type
        </span>
        <Select
          onValueChange={setNewLeadType}
          defaultValue={newLeadType}
          required
        >
          <SelectTrigger>
            <SelectValue
              className="text-tiny md:text-sm text-gray-200"
              placeholder="select Lead type"
            />
          </SelectTrigger>
          <SelectContent>
            {["hot", "warm", "cold"].map((lead) => (
              <SelectItem className="text-gray-700" key={lead} value={lead}>
                {lead}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogClose asChild>
        <Button
          type="submit"
          disabled={!newLeadType || newLeadType === leadType}
          className="bg-basePrimary w-full"
          onClick={async () => {
            await mutateData({ payload: { leadType: newLeadType } });
            await getLeads();
            await updateSelectedLead();
          }}
        >
          Change type
        </Button>
      </DialogClose>
    </div>
  );
};

export default ChangeLeadType;
