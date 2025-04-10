"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { DialogIncome } from "./modals/income/diolog-income";
import { DialogExpense } from "./modals/expense/diolog-expense";
import { DialogEmergencyFund } from "./modals/emergency-fund/diolog-emergency-fund";

export function NavActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="size-4 cursor-pointer" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-40 overflow-hidden rounded-lg p-2"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Dialog>
                    <DialogIncome />
                  </Dialog>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Dialog>
                    <DialogExpense />
                  </Dialog>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Dialog>
                    <DialogEmergencyFund />
                  </Dialog>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
