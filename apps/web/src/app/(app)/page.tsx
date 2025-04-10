import { Balance } from "@/components/balance/balance";
import { LastTransactions } from "@/components/last-transactions/last-transactions";
import { WeeklySummary } from "@/components/weekly-summary";

export default async function Home() {
  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 items-start">
        <div className="flex gap-4 w-full">
          <Balance />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <WeeklySummary />
          <LastTransactions />
        </div>
      </div>
    </div>
  );
}
