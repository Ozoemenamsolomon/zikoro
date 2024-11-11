import { cn } from "@/lib";
import { TFormattedEngagementFormAnswer } from "@/types/engagements";
import { GoDotFill } from "react-icons/go";
import { useMemo, useState } from "react";
import { IoPieChartOutline } from "react-icons/io5";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import Image from "next/image";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

export function CheckBoxTypeResponse({
  responses,
  type,
}: {
  responses: TFormattedEngagementFormAnswer[];
  type: string;
}) {
  //  console.log('responses', responses)
  const [active, setActive] = useState(0);
  const flattenedResponse = responses;
  const optionArray = flattenedResponse[0]?.optionFields;
//  console.log("responses data ", flattenedResponse);

  const reformedArray: { name: string; value: number; option: string }[] =
    useMemo(() => {
      const mappedArray = optionArray.map((v: any, index: number) => {
        const selectedCount = flattenedResponse.filter((selected) => {
          // console.log(selected.response, v.id,)
          return type === "multi"
            ? selected.response
                ?.map(({ optionId }: { optionId: any }) => optionId)
                .includes(v.id)
            : selected.response?.optionId === v.id;
        }).length;
        // console.log(selectedCount)
        return {
          name: `Option ${index + 1}`,
          option: v?.option || v?.optionImage,
          value: selectedCount || 0,
        };
      });
      return mappedArray;
    }, [responses]);

 // console.log("dddd", reformedArray);

  const sum = useMemo(() => {
    return reformedArray.reduce((acc, curr) => acc + curr?.value, 0) || 0;
  }, [reformedArray]);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

  const COLORS = reformedArray.map(() => generateRandomColor());

  const renderLabel = (props: any) => {
    const { x, y, width, value } = props;
    const percentage = ((value / sum) * 100).toFixed(2);
    return (
      <text x={x + width + 10} y={y + 10} fill="#000" fontSize={12}>
        {`${percentage}%`}
      </text>
    );
  };
  return (
    <div className="w-[95%] max-w-2xl mx-auto rounded-lg border  p-4">
      <div className="flex items-end mb-4 w-full justify-end">
        <div className="rounded-lg border p-1 items-center flex">
          <button
            onClick={() => setActive(0)}
            className={cn(
              "rounded-lg px-3 py-2 ",
              active === 0 && "bg-basePrimary text-white "
            )}
          >
            <IoPieChartOutline size={24} />
          </button>
          <button
            onClick={() => setActive(1)}
            className={cn(
              "rounded-lg px-3 py-2 ",
              active === 1 && "bg-basePrimary text-white "
            )}
          >
            <RiBarChartHorizontalLine size={24} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "w-full flex-col sm:flex-row hidden items-start justify-between",
          active === 0 && "flex"
        )}
      >
        <div className="w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={200} height={200}>
              <Pie
                data={reformedArray}
                cx="50%"
                cy="50%"
                labelLine={false}
                // label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reformedArray.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[50%]">
          <div className="w-full p-2 mb-6 grid grid-cols-3 gap-2">
            <p className="w-1 h-1"></p>
            <p>Responses</p>
            <p>%</p>
          </div>
          {reformedArray?.map((v, index, arr) => (
            <div key={index} className="w-full grid grid-cols-3 gap-2 p-2 mb-1">
              <div className="w-full flex items-center gap-x-1">
                <GoDotFill size={24} color={COLORS[index]} />
                <p>{v?.name}</p>
              </div>
              <p className="text-center">{v?.value}</p>
              <p>{((v?.value / sum) * 100 || 0).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className={cn("w-full hidden", active === 1 && "block")}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            width={300}
            height={300}
            data={reformedArray}
            margin={{
              top: 20,
              right: 40,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis axisLine={false} type="number" />
            <YAxis axisLine={false} type="category" dataKey="name" />
            <Tooltip />
            {/* <Legend /> */}
            <Bar
              radius={10}
              dataKey="value"
              background={{ fill: "#001FCC19" }}
              barSize={20}
            >
              {reformedArray.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
              <LabelList dataKey="value" content={renderLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full flex flex-col items-start justify-start  gap-3">
        {reformedArray?.map((v, index) => (
          <div className=" flex w-full items-start gap-x-2">
            <GoDotFill size={24} color={COLORS[index]} />
            <div>
              {v?.option?.startsWith("https://") ? (
                <Image
                  src={v?.option}
                  alt=""
                  className="w-[50px] h-[50px]"
                  width={50}
                  height={50}
                />
              ) : (
                v?.option
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
