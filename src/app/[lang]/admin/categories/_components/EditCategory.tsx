"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages } from "@/constants/enums";
import { Translations } from "@/types/translations";
import { EditIcon } from "lucide-react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { updateCategory } from "../_actions/category";
import { Category } from "@/generated/prisma";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";


type InitialStateType = {
  message?: string;
  error?: ValidationError;
  status?: number | null;
};
const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};

function EditCategory({
  translations,
  category,
}: {
  translations: Translations;
  category: Category;
}) {
  const { locale } = useParams();
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [state, action, pending] = useActionState(
    updateCategory.bind(null, category.id),
    initialState
  );

  useEffect(() => {
    if (state.status && state.message) {
      if (state.status === 200) {
        toast.success(state.message, {
          className: "text-green-400!",
        });
        dialogRef.current?.click();
      } else {
        toast.error(state.message, {
          className: "text-destructive!",
        });
      }
    }

  }, [state.status, state.message]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle
            className={
              locale === Languages.ARABIC ? "text-right!" : "text-left!"
            }
          >
            {translations.admin.categories.form.editName}
          </DialogTitle>
        </DialogHeader>
        <form action={action} className="pt-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="category-name">
              {translations.admin.categories.form.name.label}
            </Label>
            <div className="flex-1 relative">
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                defaultValue={category.name}
                placeholder={
                  translations.admin.categories.form.name.placeholder
                }
              />
              {state.error?.categoryName && (
                <p className="text-sm text-destructive absolute top-12">
                  {state.error?.categoryName}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-10">
            <Button type="submit" disabled={pending}>
              {pending ? <Loader /> : translations.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <DialogTrigger ref={dialogRef} />
    </Dialog>
  );
}

export default EditCategory;