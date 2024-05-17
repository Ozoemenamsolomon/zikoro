import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";
import { toast } from "@/components/ui/use-toast";

const First = ({
  setExcelResult,
  step,
  setStep,
}: {
  setExcelResult: Dispatch<SetStateAction<any>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const readFile = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target) {
        const data = e.target.result;
        
        const dt = XLSX.read(data, { type: "binary" });
        const first_worksheet = dt.Sheets[dt.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(first_worksheet, {
          header: 1,
        }) as any[][];
        

        if (jsonData[0].length >= 4) {
          setExcelResult(jsonData);
          setStep(1);
        } else {
          toast({
            description: "There should be at least four columns: first name, last name, email, phone number",
            variant: "destructive",
          });
        }
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  return (
    <>
      <div className="flex justify-center pt-8">
        <Image
          src={"/images/exceltopc.png"}
          width={200}
          height={200}
          alt={"excel to pc"}
        />
      </div>
      <div className="space-y-2">
        <div className="flex gap-4">
          <Input
            disabled
            className="flex-[70%] bg-gray-200 text-gray-700"
            placeholder={
              selectedFile ? selectedFile.name : "Upload an excel sheet file"
            }
          />
          <label
            htmlFor="excel"
            className="hover:cursor-pointer flex justify-center items-center gap-6 h-10 w-full border border-gray-300 bg-gray-200 px-3 py-2 text-sm flex-[30%]"
          >
            Choose File
          </label>
          <input
            name="excel"
            id="excel"
            type="file"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
          />
        </div>
        <a
          href={"/templates/attendees_templates.xlsx"}
          download={"attendees_template.xlsx"}
          className="text-blue-300 hover:text-blue-500 text-xs flex gap-2 items-center"
        >
          <span>Download a sample template</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M8.295 4.5H7.5V2C7.5 1.725 7.275 1.5 7 1.5H5C4.725 1.5 4.5 1.725 4.5 2V4.5H3.705C3.26 4.5 3.035 5.04 3.35 5.355L5.645 7.65C5.84 7.845 6.155 7.845 6.35 7.65L8.645 5.355C8.96 5.04 8.74 4.5 8.295 4.5ZM2.5 9.5C2.5 9.775 2.725 10 3 10H9C9.275 10 9.5 9.775 9.5 9.5C9.5 9.225 9.275 9 9 9H3C2.725 9 2.5 9.225 2.5 9.5Z"
              fill="#2685CA"
            />
          </svg>
        </a>
      </div>
      <Button
        onClick={readFile}
        disabled={!selectedFile}
        className="bg-basePrimary w-full"
      >
        Continue
      </Button>
    </>
  );
};

export default First;
