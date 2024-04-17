import React, { useState, useEffect } from "react";
import { useGetAffiliates } from "@/hooks/services/marketing";
import { useFilter } from "@/hooks/common/useFilter";
import Filter from "@/components/Filter";
import { extractUniqueTypes } from "@/utils/helpers";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateAffiliateForm from "@/components/forms/createAffiliateForm";
import useSearch from "@/hooks/common/useSearch";
import { TAffiliate } from "@/types/marketing";

const Affiliates = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { getAffiliates, affiliates, isLoading } = useGetAffiliates();
  const { searchTerm, searchedData, setSearchTerm } = useSearch<TAffiliate>({
    data: affiliates || [],
    accessorKey: ["email", "firstName", "lastname"],
  });

  return (
    <section className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Affiliate</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-basePrimary flex gap-4 items-center">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 1024 1024"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
              </svg>
              <span>Affiliate</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="px-3">
            <DialogHeader>
              <DialogTitle>
                <span className="capitalize">Create affiliate</span>
              </DialogTitle>
            </DialogHeader>
            <CreateAffiliateForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        <div className="absolute !my-0 left-2 z-10 h-full flex items-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z" />
          </svg>
        </div>
        <Input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          disabled={isLoading}
          onInput={(event) => setSearchTerm(event.currentTarget.value)}
          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-2xl pl-8 w-full"
        />
      </div>
      <div className="space-y-2 w-full overflow-auto">
        <DataTable<TAffiliate>
          columns={columns}
          data={searchedData}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          rowStyle={{
            display: "grid",
            gridTemplateColumns: `auto repeat(2, minmax(0, 1fr)) 1.5fr repeat(3, minmax(0, 1fr)) auto`,
          }}
        />
      </div>
    </section>
  );
};

export default Affiliates;
