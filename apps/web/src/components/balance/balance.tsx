"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { getBalance, GetBalanceResponse } from "@/http/get-balance";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  DollarSign,
  Eye,
  ScanEye,
} from "lucide-react";
import { useDateStore } from "@/stores/useDateStore";

export function Balance() {
  const { date } = useDateStore();
  const [data, setData] = useState<GetBalanceResponse[]>();

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await getBalance({ date: date.toISOString() });
        // I had done it if the chart only accepted numbers
        // const converted = response.map((item) => ({
        //   month: item.month,
        //   incomes: Number(item.incomes),
        //   expenses: Number(item.expenses),
        //   balance: Number(item.balance),
        // }));
        setData(response);
      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();
          console.log(message);
          toast.error("[Balance] - An unexpected error occurred");
          return
        }

        toast.error("Error when searching Balance");

      }
    }

    fetchBalance();
  }, [date]);

  // const chartConfig = {
  //   incomes: {
  //     label: "Incomes",
  //     color: "hsl(var(--chart-1))",
  //   },
  //   expenses: {
  //     label: "Expenses",
  //     color: "hsl(var(--chart-2))",
  //   },
  // } satisfies ChartConfig;

  return (
    <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          {/* <DollarSign size={16} /> */}
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data ? (
              Number(data[0].balance) >= 0 ? (
                `R$${data[0].balance}`
              ) : (
                data[0].balance.replace("-", "-R$")
              )
            ) : (
              <Skeleton className="w-full h-[25px]" />
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Incomes</CardDescription>
          {/* <BanknoteArrowUp size={20} /> */}
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data ? (
              `R$${data[0].incomes}`
            ) : (
              <Skeleton className="w-full h-[25px]" />
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Expenses</CardDescription>
          {/* <BanknoteArrowDown size={20} /> */}
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data ? (
              `R$${data[0].expenses}`
            ) : (
              <Skeleton className="w-full h-[25px]" />
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Performance</CardDescription>
          {/* <Eye size={20} /> */}
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data ? (
              Number(data[0].predicted) > 0 ? (
                `R$${data[0].predicted}`
              ) : (
                data[0].predicted.replace("-", "-R$")
              )
            ) : (
              <Skeleton className="w-full h-[25px]" />
            )}
          </CardTitle>
        </CardHeader>
      </Card>
      {/* <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Monthly Balance</CardTitle>
          <CardDescription>{data ? data[0].month : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          {data ? (
            <div className="grid justify-items-center">
              <ChartContainer
                config={chartConfig}
                className="mb-[-100px] w-full"
              >
                <RadialBarChart
                  data={data}
                  endAngle={180}
                  innerRadius={120}
                  outerRadius={200}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 16}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {`${data[0].balance}`}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 4}
                                className="fill-muted-foreground"
                              >
                                Balance
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="incomes"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-chart-2)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="expenses"
                    fill="var(--color-chart-1)"
                    stackId="a"
                    cornerRadius={5}
                    className="stroke-transparent stroke-2"
                  />
                </RadialBarChart>
              </ChartContainer>
              <CardFooter className="grid grid-cols-[1fr_1fr]">
                <div className="grid p-4 gap-2 items-center justify-items-center border-r-2">
                  <p className="text-2xl font-bold">
                    <span className="text-muted-foreground text-sm font-normal">
                      R${" "}
                    </span>
                    {data[0].initial}
                  </p>
                  <CardDescription>Initial</CardDescription>
                </div>

                <div className="grid p-4 gap-2 items-center justify-items-center">
                  <p className="text-2xl font-bold">
                    <span className="text-muted-foreground text-sm font-normal">
                      R${" "}
                    </span>
                    {data[0].predicted}
                  </p>
                  <CardDescription>Predicted</CardDescription>
                </div>
              </CardFooter>
            </div>
          ) : (
            <Skeleton className="h-full w-full rounded-xl" />
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
