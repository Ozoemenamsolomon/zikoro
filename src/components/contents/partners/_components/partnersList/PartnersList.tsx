import { EmailOutline } from "@styled-icons/evaicons-outline/EmailOutline";
import { Whatsapp } from "@styled-icons/boxicons-logos/Whatsapp";
import { Call } from "styled-icons/material";
export function PartnersList() {
  return (
    <div className="w-full lg:col-span-5 flex flex-col border-r">
      <div className="w-full grid grid-cols-7 text-mobile font-medium items-center bg-gray-200 gap-3 p-3 ">
        <p>Organization</p>
        <p className="col-span-2 w-full">Contact</p>
        <p>Type</p>
        <p>Level</p>
        <p>Exhibiton Hall</p>
        <p>Booth</p>
      </div>

      {[1, 2, 3, 4, 5].map((_) => (
        <PartnerWidget key={_} />
      ))}
    </div>
  );
}

function PartnerWidget() {
  return (
    <div className="w-full grid grid-cols-7 text-mobile  items-center gap-3 p-3 ">
      <p>OrthoEx</p>
      <div className="flex items-center gap-x-2 col-span-2">
        <EmailOutline />
        <Whatsapp />
        <Call />
      </div>
      <p>Exhibitor</p>
      <p>Amateur</p>
      <p>MKO Abiola</p>
      <p>20,000</p>
    </div>
  );
}
