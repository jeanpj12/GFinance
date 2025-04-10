"use client";

import {
  Dialog,
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
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { useFormState } from "@/hooks/use-form-state";
import { addCategoryAction } from "./actions";
import { HTTPError } from "ky";

interface DialogAddCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setCategories: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }[]>
  >;
}

export function DialogAddCategory({
  open,
  setCategories,
  onOpenChange,
}: DialogAddCategoryProps) {
  const [{ errors, message, sucess }, handleAddCategory, isPending] =
    useFormState(addCategoryAction);

  if (sucess === false && message) {
    toast.error(message);
  }

  useEffect(() => {
    if (sucess === true) {
      toast.success("Categoria adicionada com sucesso!");
      onOpenChange(false);
    }

    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json();

          console.log(message);

          toast.error("Error when searching categories");
        }
      }
    }

    fetchCategories();
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
