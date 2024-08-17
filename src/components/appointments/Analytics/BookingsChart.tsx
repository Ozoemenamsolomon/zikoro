"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, getDay, getMonth, getYear, startOfWeek, startOfMonth, endOfWeek, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from "date-fns"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SectionOneProps } from "./SectionOne"
import { Booking } from "@/types/appointments"

interface ChartDataProp {
  period: string
  value: number
}

// Function to transform data based on type
const transformData = (data: Booking[], type: string): ChartDataProp[] => {
  const groupedData: Record<string, number> = {}

  if (type === "weekly") {
    // Group by days of the current week
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())

    eachDayOfInterval({ start: weekStart, end: weekEnd }).forEach((date) => {
      const key = format(date, "EEEE") // Full day name (e.g., "Monday")
      groupedData[key] = 0
    })

    data.forEach(({ appointmentDate }) => {
      const date = new Date(appointmentDate!)
      const key = format(date, "EEEE")
      if (groupedData[key] !== undefined) {
        groupedData[key] += 1
      }
    })

  } else if (type === "monthly") {
    // Group by weeks of the current month (Week 1, Week 2, Week 3, Week 4)
    const monthStart = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())

    eachWeekOfInterval({ start: monthStart, end: monthEnd }).forEach((date, index) => {
      const key = `Week ${index + 1}`
      groupedData[key] = 0
    })

    data.forEach(({ appointmentDate }) => {
      const date = new Date(appointmentDate!)
      const weekOfMonth = Math.floor((date.getDate() - 1) / 7) + 1
      const key = `Week ${weekOfMonth}`
      if (groupedData[key] !== undefined) {
        groupedData[key] += 1
      }
    })

  } else if (type === "yearly") {
    // Group by months of the current year
    const yearStart = new Date(getYear(new Date()), 0, 1)
    const yearEnd = new Date(getYear(new Date()), 11, 31)

    eachMonthOfInterval({ start: yearStart, end: yearEnd }).forEach((date) => {
      const key = format(date, "MMMM") // Full month name (e.g., "January")
      groupedData[key] = 0
    })

    data.forEach(({ appointmentDate }) => {
      const date = new Date(appointmentDate!)
      const key = format(date, "MMMM")
      if (groupedData[key] !== undefined) {
        groupedData[key] += 1
      }
    })
  } else {
    throw new Error("Invalid type provided")
  }

  return Object.entries(groupedData).map(([key, value]) => ({
    period: key,
    value,
  }))
}

// Function to calculate trend percentage
const calculateTrend = (currentData: ChartDataProp[], previousData: ChartDataProp[]): number => {
  const currentTotal = currentData.reduce((acc, curr) => acc + curr.value, 0)
  const previousTotal = previousData.reduce((acc, curr) => acc + curr.value, 0)

  if (previousTotal === 0) return currentTotal > 0 ? 100 : 0

  const trend = ((currentTotal - previousTotal) / previousTotal) * 100
  return trend
}

export const BookingsChart: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  const chartData = React.useMemo(() => transformData(current, type), [current, type])
  const trend = React.useMemo(() => calculateTrend(chartData, transformData(previous, type)), [chartData, previous, type])
  console.log({chartData})
  const chartConfig = {
    value: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      {isLoading ? (
        <div className="flex py-20 justify-center items-center h-full animate-pulse">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="flex py-20 justify-center items-center h-full text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={true}
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="hsla(252, 100%, 97%, 1)"
              fillOpacity={0.4}
              stroke="hsla(231, 100%, 40%, 1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend > 0 ? (
                <>
                  Trending up by {trend.toFixed(2)}% <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Trending down by {Math.abs(trend).toFixed(2)}% <TrendingDown className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {type.charAt(0).toUpperCase() + type.slice(1)} View
            </div>
          </div>
        </div>
      </CardFooter>
      </>
      )}
    </Card>
  )
}
