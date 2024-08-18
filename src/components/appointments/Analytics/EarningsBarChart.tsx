"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { format, getISOWeek, getYear, startOfWeek, startOfMonth, endOfWeek, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { SectionOneProps } from "./SectionOne"
import { Booking } from "@/types/appointments"
import React from "react"

interface ChartDataProp {
  period: string
  current: number
  previous: number
}

// Function to transform data based on type
const transformData = (data: Booking[], type: string): Record<string, number> => {
  const groupedData: Record<string, number> = {}

  if (type === "weekly") {
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())

    eachDayOfInterval({ start: weekStart, end: weekEnd }).forEach((date) => {
      const key = format(date, "EEEE")
      groupedData[key] = 0
    })

    data.forEach(({ appointmentDate, price }) => {
      const date = new Date(appointmentDate!)
      const key = format(date, "EEEE")
      if (groupedData[key] !== undefined) {
        groupedData[key] += Number(price)
      }
    })
  } else if (type === "monthly") {
    const monthStart = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())

    eachWeekOfInterval({ start: monthStart, end: monthEnd }).forEach((date) => {
      const key = `Week ${getISOWeek(date)}`
      groupedData[key] = 0
    })

    data.forEach(({ appointmentDate, price }) => {
      const date = new Date(appointmentDate!)
      const key = `Week ${getISOWeek(date)}`
      if (groupedData[key] !== undefined) {
        groupedData[key] += Number(price)
      }
    })
  } else if (type === "yearly") {
    const yearStart = new Date(getYear(new Date()), 0, 1)
    const yearEnd = new Date(getYear(new Date()), 11, 31)

    eachMonthOfInterval({ start: yearStart, end: yearEnd }).forEach((date) => {
      const key = format(date, "MMMM")
      groupedData[key] = 0
    })

    data.forEach(({ appointmentDate, price }) => {
      const date = new Date(appointmentDate!)
      const key = format(date, "MMMM")
      if (groupedData[key] !== undefined) {
        groupedData[key] += Number(price)
      }
    })
  } else {
    throw new Error("Invalid type provided")
  }

  return groupedData
}

// Function to merge current and previous data into one dataset
const mergeData = (currentData: Record<string, number>, previousData: Record<string, number>): ChartDataProp[] => {
  const allPeriods = new Set([...Object.keys(currentData), ...Object.keys(previousData)])

  return Array.from(allPeriods).map((period) => ({
    period,
    current: currentData[period] || 0,
    previous: previousData[period] || 0,
  }))
}

// Function to calculate trend percentage
const calculateTrend = (currentData: ChartDataProp[], previousData: ChartDataProp[]): number => {
  const currentTotal = currentData.reduce((acc, curr) => acc + curr.current, 0)
  const previousTotal = previousData.reduce((acc, curr) => acc + curr.previous, 0)

  if (previousTotal === 0) return currentTotal > 0 ? 100 : 0

  const trend = ((currentTotal - previousTotal) / previousTotal) * 100
  return trend
}

const chartConfig = {
  desktop: {
    label: "Previous Period",
    color: "#9D00FF",
  },
  mobile: {
    label: "Current Period",
    color: "#001FCC",
  },
} satisfies ChartConfig

export const EarningsBarChart: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  const currentData = React.useMemo(() => transformData(current, type), [current, type])
  const previousData = React.useMemo(() => transformData(previous, type), [previous, type])

  const chartData = React.useMemo(() => mergeData(currentData, previousData), [currentData, previousData])
  const trend = React.useMemo(() => calculateTrend(chartData, chartData), [chartData])

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
        {isLoading ? (
            <div className="flex py-20 justify-center items-center h-full animate-pulse">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="flex py-20 justify-center items-center h-full text-red-500">
              <p>{error}</p>
            </div>
          ) : (
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="period" tickLine={false} tickMargin={8} axisLine={false} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
            <Legend />
            <Bar dataKey="previous" fill="#9D00FF" name="Previous Period" radius={4} />
            <Bar dataKey="current" fill="#001FCC" name="Current Period" radius={4} />
          </BarChart>
        )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
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
        <div className="leading-none text-muted-foreground">
          {/* Showing total earnings comparison for the selected period. */}
        </div>
      </CardFooter>
    </Card>
  )
}
