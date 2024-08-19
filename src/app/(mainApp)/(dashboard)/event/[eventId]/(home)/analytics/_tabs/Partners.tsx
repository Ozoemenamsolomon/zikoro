import React from "react";
import handshake from "@/public/icons/handshake.svg";
import peopleStar from "@/public/icons/people_star.svg";
import peopleEye from "@/public/icons/people_eye.svg";
import peopleFilter from "@/public/icons/people_filter.svg";
import moneyUp from "@/public/icons/money_up.svg";
import stamper from "@/public/icons/stamper.svg";
import booth from "@/public/icons/booth.svg";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import { useParams } from "next/navigation";
import { useFetchPartners } from "@/hooks";
import { ILead, TLeadsInterest, TPartner } from "@/types";
import { useGetData } from "@/hooks/services/request";
import { formatNumberToShortHand } from "@/utils";
import { AnalyticsInfoCard } from "../page";

interface TPartnerDataSet {
  id: number;
  value: number;
  label: string;
  color: string;
}

const randomColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];

const Partners = () => {
  const { eventId } = useParams();

  const { data, loading, refetch } = useFetchPartners(eventId);
  const {
    data: leads,
    isLoading,
    getData: getLeads,
  } = useGetData<ILead[]>(`/leads?eventAlias=${eventId}`, true, []);
  const { data: leadInterests, isLoading: interestsIsLoading } = useGetData<
    TLeadsInterest[]
  >(`/leads/interests?eventAlias=${eventId}&interestType=Offer`, true, []);

  console.log(data);

  const totalPartnersRevenue = leadInterests?.reduce(
    (acc, { offerAmount }) => acc + offerAmount,
    0
  );

  const revenueFromPartners = data?.reduce(
    (acc, { amountPaid }) => acc + amountPaid,
    0
  );

  const calculatePartnerRevenue = (partnerAlias: string) =>
    leadInterests
      .filter(({ eventPartnerAlias }) => partnerAlias === eventPartnerAlias)
      ?.reduce((acc, { offerAmount }) => acc + offerAmount, 0);

  const getPartnersDataSet = (partners: TPartner[]): TPartnerDataSet[] =>
    partners
      .sort(
        (a, b) =>
          leads.filter(
            ({ eventPartnerAlias }) => eventPartnerAlias === b.partnerAlias
          ).length -
          leads.filter(
            ({ eventPartnerAlias }) => eventPartnerAlias === a.partnerAlias
          ).length
      )
      .map(({ partnerAlias, id, companyName }, index) => {
        console.log(leads);
        const value =
          (leads &&
            leads.filter(
              ({ eventPartnerAlias }) => eventPartnerAlias === partnerAlias
            ).length) ||
          0;

        const color = randomColors[index];

        return {
          id: id,
          value,
          label: companyName,
          color,
        };
      });

  const partnersDataSet = getPartnersDataSet(data);

  console.log(partnersDataSet);

  return (
    <>
      <section className="grid md:grid-cols-3 gap-4">
        <AnalyticsInfoCard
          label={"Total Partners"}
          value={
            data?.filter(({ partnerType }) => partnerType === "Partner")
              .length ?? 0
          }
          Icon={() => (
            <img className="h-10 w-10" src={handshake.src} alt={"handshake"} />
          )}
        />
        <AnalyticsInfoCard
          label={"Total Sponsors"}
          value={
            data?.filter(({ partnerType }) => partnerType === "Sponsor")
              .length ?? 0
          }
          Icon={() => (
            <img className="h-10 w-10" src={peopleStar.src} alt={"handshake"} />
          )}
        />

        <AnalyticsInfoCard
          label={"Total Exhibitors"}
          value={
            data?.filter(({ partnerType }) => partnerType === "Exhibitor")
              .length ?? 0
          }
          Icon={() => (
            <img className="h-10 w-10" src={booth.src} alt={"handshake"} />
          )}
        />

        <AnalyticsInfoCard
          label={"Average Leads"}
          value={leads.length / data.length}
          Icon={() => (
            <img
              className="h-10 w-10"
              src={peopleFilter.src}
              alt={"people eye"}
            />
          )}
        />
        <AnalyticsInfoCard
          label={"Total Partners Revenue"}
          value={formatNumberToShortHand(totalPartnersRevenue)}
          Icon={() => (
            <img className="h-10 w-10" src={moneyUp.src} alt={"money up"} />
          )}
        />
        <AnalyticsInfoCard
          label={"Revenue From Partners"}
          value={formatNumberToShortHand(revenueFromPartners)}
          Icon={() => (
            <img className="h-10 w-10" src={moneyUp.src} alt={"money up"} />
          )}
        />
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">Sponsors</h2>
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
            {data &&
              data.map(
                ({
                  companyName,
                  partnerType,
                  id,
                  partnerAlias,
                  companyLogo,
                }) => (
                  <tr className="flex p-4 text-gray-800">
                    <td className="flex-[40%] flex items-center gap-4">
                      {companyLogo ? (
                        <img
                          className="h-10 w-10"
                          src={companyLogo}
                          alt={companyName}
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100" />
                      )}
                      <span>{companyName}</span>
                    </td>
                    <td className="flex-[20%]">{partnerType}</td>
                    <td className="flex-[10%]">
                      {
                        leads?.filter(
                          ({ eventPartnerAlias }) =>
                            eventPartnerAlias === partnerAlias
                        ).length
                      }
                    </td>
                    <td className="flex-[30%]">
                      {formatNumberToShortHand(
                        calculatePartnerRevenue(partnerAlias)
                      )}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">Partners</h2>
        <div className="bg-basePrimary/10 p-4 m-4 border rounded-md grid md:grid-cols-2 gap-4">
          <PieChart
            colors={["blue", "purple", "black"]}
            series={[
              {
                data: partnersDataSet,
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
            <div className="bg-white p-2 w-4/5 border rounded-md [&>*:not(:last-child)]:border-b max-h-[250px] overflow-auto">
              {partnersDataSet.map(({ label, value, color, id }) => (
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
                          partnersDataSet.reduce(
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
