"use client";

import {
  getLastTransactions,
  GetLastTransactionsResponse,
} from "@/http/get-last-transactions";
import { TableTransaction } from "../table-transaction";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import {
  getTransactions,
  GetTransactionsResponse,
} from "@/http/get-transactions";
import { useDateStore } from "@/stores/useDateStore";

interface TransactionsProps {
  type?: "EXPENSE" | "INCOME";
}

export function Transactions({ type }: TransactionsProps) {
  const [data, setData] = useState<GetTransactionsResponse[]>();
  const { date } = useDateStore();

  useEffect(() => {
    async function fetchLastTransitions() {
      try {
        const response = await getTransactions({ date: date.toDateString() });

        if (type && type === "EXPENSE") {
          const filterTransactions = response.filter(
            (transaction) => transaction.type === type
          );

          const mappedData = filterTransactions.map((transition) => ({
            ...transition,
            amount: transition.amount * -1,
          }));

          setData(mappedData);
        }

        if (type && type === "INCOME") {
          const filterTransactions = response.filter(
            (transaction) => transaction.type === type
          );

          setData(filterTransactions);
        }

      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();
          console.log(message);
          toast.error("Error when searching transactions");
        }

        toast.error("[Transitions] - An unexpected error occurred");
      }
    }

    fetchLastTransitions();
  }, [date]);

  return (
    <div className="w-full">
      <Card>
        <CardContent>
          {data ? (
            <TableTransaction
              data={data}
              footer={false}
              headerFilters={false}
              select={false}
            />
          ) : (
            <Skeleton className="h-60 w-full rounded-xl" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
