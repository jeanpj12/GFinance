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

export function LastTransactions() {
  const [data, setData] = useState<GetLastTransactionsResponse[]>();

  useEffect(() => {
    async function fetchLastTransitions() {
      try {
        const response = await getLastTransactions();

        const mappedData = response
          .map((transition) => ({
            ...transition,
            amount:
              transition.type === "EXPENSE"
                ? transition.amount * -1
                : transition.amount,
          }))
          .slice(0, 10);

        setData(mappedData);
      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();
          console.log(message);
          toast.error("Error when searching last transactions");
        }

        toast.error("[Last Transitions] - An unexpected error occurred");
      }
    }

    fetchLastTransitions();
  }, []);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Latest transactions added</CardTitle>
        </CardHeader>
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
