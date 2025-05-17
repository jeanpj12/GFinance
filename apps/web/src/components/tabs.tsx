import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs as Tab,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LastTransactions } from "./last-transactions/last-transactions";
import { ComponentType, ReactElement, ReactNode } from "react";

type TabItem = {
  name: string;
  content: ReactNode;
};

export function Tabs({ contentList }: { contentList: TabItem[] }) {
  return (
    <Tab defaultValue={contentList[0].name}>
      <TabsList className={`grid w-full grid-cols-${contentList.length}`}>
        {contentList.map((item) => (
          <TabsTrigger key={item.name} value={item.name}>
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {contentList.map((item) => (
        <TabsContent key={item.name} value={item.name}>
          {item.content}
        </TabsContent>
      ))}
    </Tab>
  );
}
