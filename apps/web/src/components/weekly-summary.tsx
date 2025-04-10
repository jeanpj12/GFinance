"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { use, useEffect, useState } from "react";
import { getWeeklySummary } from "@/http/get-weekly-summary";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { HTTPError } from "ky";

type dataType = {
  expense: number;
  income: number;
  dayMonth: string;
};

export function WeeklySummary() {
  const [data, setData] = useState<dataType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWeeklySummary();
        setData(response);
      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();
          console.log(message);
          toast.error("Error when searching last weekly summary");
        }

        toast.error("[Weekly Summary] - An unexpected error occurred");
      }
    }

    fetchData();
  }, []);

  const chartConfig = {
    desktop: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Expense",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>
            Showing income and expenses for the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data ? (
            <ChartContainer config={chartConfig} className="max-h-[300px] min-w-full">
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="dayMonth"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="income" fill="var(--color-chart-2)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <Skeleton className="h-60 w-full rounded-xl" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
