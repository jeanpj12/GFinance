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
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { getCategories } from "@/http/get-categories";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { cn } from "@/lib/utils";
import { HTTPError } from "ky";
import { toast } from "sonner";
import { getSubCategories } from "@/http/get-subcategories";
import { Switch } from "../../ui/switch";
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import { SidebarMenuButton } from "../../ui/sidebar";
import { useFormState } from "@/hooks/use-form-state";
import { addIncome } from "./actions";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogAddCategory } from "../category/diolog-add-category";
import { DialogAddSubcategory } from "../subcategory/diolog-add-subcategory";

export function DialogIncome() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const [openCategory, setOpenCategory] = useState(false);
  const [openSubcategory, setOpenSubcategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [subCategoryValue, setSubCategoryValue] = useState("");
  const [date, setDate] = useState<Date>();
  const [isPaid, setIsPaid] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubategory] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories("INCOME");
        setCategories(data);
      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();

          console.log(message);

          toast.error("[MODAL - INCOME]Error when searching categories");
        }
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryValue) {
      async function fetchSubCategories() {
        try {
          const data = await getSubCategories(categoryValue);
          setSubCategories(data);
        } catch (err) {
          if (err instanceof HTTPError) {
            const { message } = await err.response.json();

            console.log(message);

            toast.error("Error when searching sub categories");
          }
        }
      }

      fetchSubCategories();
    }
  }, [categoryValue]);

  const [{ errors, message, sucess }, handleAddIncome, isPending] =
    useFormState(addIncome);

  if (sucess === false && message) {
    toast.error(message);
  }

  return (
    <div>
      <DialogTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <Plus className="size-4" />
          <span>Add Income</span>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Add a new income by filling in the fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddIncome} className="space-y-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input id="name" name="name" className="col-span-3" />
            {errors?.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid items-center gap-2">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              className="col-span-3"
            />
            {errors?.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

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

          <div className="grid grid-cols-[1fr_40px] items-end gap-2">
            <div className="grid items-center gap-2">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <input type="hidden" name="categoryId" value={categoryValue} />
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="w-full justify-between"
                  >
                    {categoryValue
                      ? categories.find(
                          (category) => category.id === categoryValue
                        )?.name
                      : "Select Category..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.id}
                            onSelect={(currentValue) => {
                              setCategoryValue(
                                currentValue === categoryValue
                                  ? ""
                                  : currentValue
                              );
                              setOpenCategory(false);
                            }}
                          >
                            {category.name}
                            <Check
                              className={cn(
                                "w-full",
                                categoryValue === category.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setShowAddCategory(true)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {errors?.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId}</p>
            )}
          </div>

          <div className="grid grid-cols-[1fr_40px] items-end gap-2">
            <div className="grid items-center gap-2">
              <Label htmlFor="subCategoryId" className="text-right">
                Subcategory
              </Label>
              <input
                type="hidden"
                name="subCategoryId"
                value={subCategoryValue}
              />

              <Popover open={openSubcategory} onOpenChange={setOpenSubcategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSubcategory}
                    className="w-full justify-between"
                  >
                    {subCategoryValue
                      ? subCategories.find(
                          (subcategory) => subcategory.id === subCategoryValue
                        )?.name
                      : "Select Subcategory..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search Subcategory..." />
                    <CommandList>
                      <CommandEmpty>No subcategories found.</CommandEmpty>
                      <CommandGroup>
                        {subCategories.map((subcategory) => (
                          <CommandItem
                            key={subcategory.id}
                            value={subcategory.id}
                            onSelect={(currentValue) => {
                              setSubCategoryValue(
                                currentValue === subCategoryValue
                                  ? ""
                                  : currentValue
                              );
                              setOpenSubcategory(false);
                            }}
                          >
                            {subcategory.name}
                            <Check
                              className={cn(
                                "w-full",
                                subCategoryValue === subcategory.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setShowAddSubategory(true)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {errors?.subCategoryId && (
              <p className="text-xs text-red-500">{errors.subCategoryId}</p>
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
                "Add Income"
              )}
            </Button>
          </DialogFooter>
        </form>
        <div className="hidden">
          <DialogAddCategory
            open={showAddCategory}
            onOpenChange={setShowAddCategory}
            setCategories={setCategories}
            type="INCOME"
          />

          <DialogAddSubcategory
            categories={categories}
            open={showAddSubcategory}
            onOpenChange={setShowAddSubategory}
            setSubcategories={setSubCategories}
          />
        </div>
      </DialogContent>
    </div>
  );
}
