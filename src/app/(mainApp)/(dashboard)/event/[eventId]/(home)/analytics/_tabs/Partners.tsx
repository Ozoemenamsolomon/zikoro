import React from "react";
import handshake from "@/public/icons/handshake.svg";
import peopleEye from "@/public/icons/people_eye.svg";
import moneyUp from "@/public/icons/money_up.svg";
import stamper from "@/public/icons/stamper.svg";

const AnalyticsInfoCard = ({
  label,
  Icon,
  value,
}: {
  Icon: (props: any) => React.JSX.Element;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="p-4 rounded-md bg-white border flex items-center">
      <div className="flex items-center justify-center flex-[30%]">
        <div className="bg-basePrimary/20 p-4 rounded-full h-fit w-fit">
          <Icon className="h-10 w-10 text-basePrimary" />
        </div>
      </div>
      <div className="flex-[70%] flex flex-col gap-2">
        <h3 className="font-medium text-gray-600 capitalize">{label}</h3>
        <h4 className="text-4xl font-medium text-gray-800">{value}</h4>
      </div>
    </div>
  );
};

const Partners = () => {
  return (
    <>
      <section className="grid grid-cols-3 gap-4">
        <AnalyticsInfoCard
          label={"Total Partners"}
          value={3}
          Icon={() => (
            <img className="h-10 w-10" src={handshake.src} alt={"handshake"} />
          )}
        />
        <AnalyticsInfoCard
          label={"Average Leads"}
          value={9}
          Icon={() => (
            <img className="h-10 w-10" src={peopleEye.src} alt={"people eye"} />
          )}
        />
        <AnalyticsInfoCard
          label={"Total Partners Revenue"}
          value={"150k"}
          Icon={() => (
            <img className="h-10 w-10" src={moneyUp.src} alt={"money up"} />
          )}
        />
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">Partners</h2>
        <table className="border rounded-md w-full">
          <thead className="w-full">
            <tr className="flex bg-basePrimary/10 p-4 text-gray-600 font-medium">
              <td className="flex-[40%]">Name</td>
              <td className="flex-[20%]">Partner Type</td>
              <td className="flex-[10%]">Leads</td>
              <td className="flex-[30%]">Total Partner Sales </td>
            </tr>
          </thead>
          <tbody className="[&>*:not(:last-child)]:border-b w-full font-medium">
            <tr className="flex p-4 text-gray-800">
              <td className="flex-[40%] flex items-center gap-4">
                <img className="h-10 w-10" src={stamper.src} alt={"stamper"} />
                <span>Partner's name</span>
              </td>
              <td className="flex-[20%]">Sponsor</td>
              <td className="flex-[10%]">3</td>
              <td className="flex-[30%]">$50,000</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Partners;
