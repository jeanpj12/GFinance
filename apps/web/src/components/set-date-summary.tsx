"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDateStore } from "@/stores/useDateStore";

export function SetSummaryDate() {
  const { date, setDate } = useDateStore();

  const changeMonth = (action: "next" | "back") => {
    if (!date) return;

    const newDate = new Date(date);

    if (action === "next") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (action === "back") {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    console.log(newDate.toDateString());
    setDate(newDate);
  };

  return (
    <div className="flex gap-2 items-center">
      <Button variant={"ghost"} onClick={() => changeMonth("back")} className="cursor-pointer">
        <ChevronLeft />
      </Button>
      <span>
        {date
          ?.toLocaleString("pt-BR", { month: "long" })
          .replace(/^\w/, (c) => c.toUpperCase())}
      </span>
      <span>-</span>
      <span>{date?.getFullYear()}</span>
      <Button variant={"ghost"} onClick={() => changeMonth("next")} className="cursor-pointer">
        <ChevronRight />
      </Button>
    </div>
  );
}
