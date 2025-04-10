"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { getCategories } from "@/http/get-categories";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { useFormState } from "@/hooks/use-form-state";
import { addSubcategoryAction } from "./actions";
import { HTTPError } from "ky";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getSubCategories } from "@/http/get-subcategories";

interface DialogAddSubcategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSubcategories: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }[]>
  >;
  categories: { id: string; name: string }[];
}

export function DialogAddSubcategory({
  open,
  setSubcategories,
  onOpenChange,
  categories,
}: DialogAddSubcategoryProps) {
  const [{ errors, message, sucess }, handleAddCategory, isPending] =
    useFormState(addSubcategoryAction);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");

  if (sucess === false && message) {
    toast.error(message);
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getSubCategories(categoryValue);
        setSubcategories(data);
      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();

          console.log(message);

          toast.error("[SBD-404] Error when searching categories");
        }
      }
    }

    if (sucess === true) {
      toast.success(message);
      onOpenChange(false);
      fetchCategories();
    }
  }, [sucess]);

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant={"outline"} className="cursor-pointer">
            <Plus className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid items-end gap-2">
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

              {errors?.categoryId && (
                <p className="text-xs text-red-500">{errors.categoryId}</p>
              )}
            </div>

            <div className="grid items-center gap-2">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input id="name" name="name" className="col-span-3" />
              {errors?.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Add Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
