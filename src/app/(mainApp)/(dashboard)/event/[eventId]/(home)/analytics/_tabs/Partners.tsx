import React from "react";
import handshake from "@/public/icons/handshake.svg";
import peopleEye from "@/public/icons/people_eye.svg";
import moneyUp from "@/public/icons/money_up.svg";
import stamper from "@/public/icons/stamper.svg";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";

const dummyData = [
  { label: "Apples", value: 120, color: "#FF6384", id: "1" },
  { label: "Bananas", value: 150, color: "#FFCE56", id: "2" },
  { label: "Cherries", value: 80, color: "#36A2EB", id: "3" },
  { label: "Grapes", value: 90, color: "#9966FF", id: "4" },
  { label: "Oranges", value: 100, color: "#FF9F40", id: "5" },
  { label: "Pears", value: 110, color: "#4BC0C0", id: "6" },
  { label: "Peaches", value: 70, color: "#FF6384", id: "7" },
  { label: "Plums", value: 60, color: "#FFCE56", id: "8" },
  { label: "Strawberries", value: 140, color: "#36A2EB", id: "9" },
  { label: "Watermelons", value: 130, color: "#9966FF", id: "10" },
];

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
      <section className="bg-white p-4 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">Partners</h2>
        <div className="bg-basePrimary/10 p-4 m-4 border rounded-md grid grid-cols-2 gap-4">
          <PieChart
            colors={["blue", "purple", "black"]}
            series={[
              {
                data: dummyData,
                innerRadius: 90,
                outerRadius: 120,
                cx: 150,
                cy: 150,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
                fontSize: "8px",
                color: "#001FCC",
                backgroundColor: "white",
                padding: "10px",
              },
            }}
            height={300}
            width={300}
            // width={containerDivRef.current?.offsetWidth - 16}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
            margin={{ top: 2 }}
          />
          <div className="flex items-center justify-center">
            <div className="bg-white p-2 w-4/5 border rounded-md [&>*:not(:last-child)]:border-b">
              {dummyData.map(({ label, value, color, id }) => (
                <div
                  key={id}
                  className="border-b py-2 px-4 flex items-center gap-2 w-full"
                >
                  <span
                    className="rounded-full h-5 w-5"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{label}</span>
                    <span className="font-medium text-gray-600">
                      {Number(
                        (value /
                          dummyData.reduce(
                            (acc, { value }) => acc + value,
                            0
                          )) *
                          100
                      ).toFixed() + "%"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;
