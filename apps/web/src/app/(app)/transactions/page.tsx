import { Balance } from "@/components/balance/balance";
import { LastTransactions } from "@/components/last-transactions/last-transactions";
import { MonthSummary } from "@/components/month-summary";
import { Tabs } from "@/components/tabs";
import { Transactions } from "@/components/transactions/transactions";
import { WeeklySummary } from "@/components/weekly-summary";

export default async function Home() {
  const tabsList = [
    {
      name: "Incomes",
      content: <Transactions type="INCOME"/>,
    },
    {
      name: "Expenses",
      content: <Transactions type="EXPENSE"/>,
    },
  ];

  return (
    <div className="py-4">
      <div className="">
        <Tabs contentList={tabsList}/>
      </div>
    </div>
  );
}
