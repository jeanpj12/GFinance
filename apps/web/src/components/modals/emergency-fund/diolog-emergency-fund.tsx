"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon, Loader2, Plus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "../../ui/switch";
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import { SidebarMenuButton } from "../../ui/sidebar";
import { useFormState } from "@/hooks/use-form-state";
import { addEmergencyFundAction } from "./actions";

export function DialogEmergencyFund() {
  const [date, setDate] = useState<Date>();
  const [isPaid, setIsPaid] = useState(false);

  const [{ errors, message, sucess }, handleAddEmergencyFund, isPending] =
    useFormState(addEmergencyFundAction);

  if (sucess === false && message) {
    toast.error(message);
  }

  return (
    <div>
      <DialogTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <Shield className="size-4" />
          <span>Add Emergency Fund</span>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Emergency Fund</DialogTitle>
          <DialogDescription>
            Add a new emergency fund by filling in the fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddEmergencyFund} className="space-y-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              className="col-span-3"
            />

            {errors?.amount && (
              <p className="text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isPaid"
              name="isPaid"
              checked={isPaid}
              onCheckedChange={(e) => setIsPaid(e)}
            />
            <Label htmlFor="isPaid" className="text-right">
              Is Paid
            </Label>

            {errors?.isPaid && (
              <p className="text-xs text-red-500">{errors.isPaid}</p>
            )}
          </div>

          <div className="grid items-center gap-2">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input type="hidden" name="dueDate" value={String(date)} />

            {errors?.dueDate && (
              <p className="text-xs text-red-500">{errors.dueDate}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Add Emergency Fund"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </div>
  );
}
