'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { addCategory } from "../_actions/category";

type initialStateType = {
  message?: string;
  error?: ValidationErrors;
  status?: number | null;
};
const initialState: initialStateType = {
  message: "",
  error: {},
  status: null,
};

function Form({ translations }: { translations: Translations }) {
  const [state, action, isPending] = useActionState(addCategory, initialState);

  useEffect(() => {
    if (state.status && state.message) {
      if (state.status === 201) {
        toast.success(state.message, {
          className: "text-green-400!",
        });
      } else {
        toast.error(state.message, {
          className: "text-destructive!",
        });
      }
    }
  }, [state.status, state.message]);
  return (
    <form action={action}>
      <div className="space-y-2">
        <Label htmlFor="name">{translations.admin.categories.form.name.label}</Label>
        <div className="flex items-center gap-4">
          <Input type="text" name="name" id="name" placeholder={translations.admin.categories.form.name.placeholder} />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader /> : translations.create}
          </Button>
        </div>
        {state.error?.name && (
          <p className="text-sm text-destructive">{state.error.name}</p>
        )}
      </div>
    </form>
  );
}

export default Form;
