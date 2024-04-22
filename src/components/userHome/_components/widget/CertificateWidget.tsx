import {useMemo} from "react"
import {TIssuedCertificate} from "@/types"
import {formatDate} from "@/utils"
import { AboutWidget } from "@/components/composables";
import Image from "next/image";
import { Users } from "@styled-icons/heroicons-outline/Users";
import { Check2 } from "@styled-icons/bootstrap/Check2";
import { CheckmarkDone } from "styled-icons/ionicons-outline";
export function CertificateWidget({ certificate }: { certificate: TIssuedCertificate }) {
  
    const createdAt = useMemo(() => {
        return formatDate(certificate?.created_at)
    },[certificate?.created_at])
    return (
      <div 
      onClick={() => window.open(`https://${certificate?.certificateURL}`, "_blank")}
      role="button"
      className="w-full">
        {certificate?.certificate?.cerificateUrl ? (
         <Image
         src={certificate?.certificate?.cerificateUrl}
         alt="certificate"
         width={700}
         height={600}
         className="w-full h-[250px] rounded-t-lg object-cover"
         />
        ) : (
          <div className="w-full h-[250px] rounded-t-lg animate-pulse">
            <div className="w-full h-full bg-gray-200"></div>
          </div>
        )}
        <div className="w-full flex items-start gap-x-3 p-3 sm:p-4 shadow border rounded-b-lg">
          <div className="flex gap-y-1 flex-col items-start justify-start">
            <p className="font-semibold capitalize text-base sm:text-lg">
             {certificate?.CertificateName ?? ""}
            </p>
            <AboutWidget
              Icon={Users}
              text="Event Attendees except moderator and partners"
            />
            <p className="text-sm">{createdAt || ""}</p>
  
            <AboutWidget Icon={Check2} text="Issued" />
          </div>
  
          <div className="rounded-lg flex flex-col items-center p-2 border">
            <CheckmarkDone size={22} />
            <p className="text-sm">100%</p>
          </div>
        </div>
      </div>
    );
  }
  