"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { KPIData } from "@/lib/bookingsAnalytics"

export function DoughnutChart({
  tableData,
  isLoading,
  error,
}: {
  tableData: KPIData[];
  isLoading: boolean;
  error: string;
}) {
  // Process the data to match the chart structure
  const chartData = React.useMemo(() => {
    return tableData.map(({ appointmentName, numberOfBookings, brandColor }) => ({
      browser: appointmentName,
      visitors: numberOfBookings,
      fill: brandColor,
    }))
  }, [tableData])

  // Total bookings
  const totalBookings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  // Chart configuration
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      visitors: {
        label: "Bookings",
      },
    }
    chartData.forEach(({ browser, fill }) => {
      config[browser] = { label: browser, color: fill }
    })
    return config
  }, [chartData])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px] p-0"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full animate-pulse">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalBookings.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Bookings
                      </tspan>
                    </text>
                  )
                }
                return null
              }}
            />
          </Pie>
        </PieChart>
      )}
    </ChartContainer>
  )
}
