"use client";
import { TEventTransaction } from "@/types/billing";
import React, { useState } from "react";
import { columns } from "../../../../../../billing/columns";
import { DataTable } from "@/components/DataTable";
import { RowSelectionState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useGetAffiliateLink } from "@/hooks/services/marketing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import RequestPayoutDialog from "@/components/requestPayoutDialog";

const LinkDetails = () => {
  const { linkId } = useParams();

  if (Array.isArray(linkId)) return null;
  const { affiliateLink, getAffiliateLink, isLoading } = useGetAffiliateLink({
    linkId: parseInt(linkId),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <div className="bg-white pt-8 px-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-grayBlack font-medium">Payout History</h1>
        <Dialog
          onOpenChange={(newOpen) => {
            if (
              newOpen && 
              (!affiliateLink?.eventTransactions ||
                (affiliateLink?.eventTransactions &&
                  affiliateLink?.eventTransactions.filter(
                    ({ id }) => rowSelection[id]
                  ).length === 0))
            )
              toast({
                description: "Please select unrequested transactions",
              });
          }}
        >
          <DialogTrigger
            asChild
            disabled={ 
              affiliateLink?.eventTransactions &&
              affiliateLink.eventTransactions.filter(
                ({ id }) => rowSelection[id]
              ).length === 0
            }
          >
            <Button className="bg-basePrimary w-fit px-4">
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent className="px-3 max-h-[500px] hide-scrollbar overflow-auto">
            <DialogHeader>
              <DialogTitle>
                <span className="capitalize">Request Payout</span>
              </DialogTitle>
            </DialogHeader>
            <RequestPayoutDialog
              selectedRows={
                (affiliateLink?.eventTransactions &&
                  affiliateLink.eventTransactions.filter(
                    ({ id }) => rowSelection[id]
                  )) ||
                []
              }
              getEventTransactions={async () => {}}
            />
          </DialogContent>
        </Dialog>{" "}
      </div>
      <DataTable<TEventTransaction>
        columns={columns}
        data={affiliateLink?.eventTransactions || []}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        canSelectRow={(row) => row?.original?.payOutStatus === "new"}
        rowStyle={{
          display: "grid",
          gridTemplateColumns: `auto 1.5fr repeat(${
            columns.length - 2
          }, minmax(0, 1fr))`,
        }}
      />
    </div>
  );
};

export default LinkDetails;
