"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { signup } from "@/server/_actions/auth";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { ValidationErrors } from "@/validations/auth";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState: {
  message?: string;
  error?: ValidationErrors;
  status?: number | null;
  formData?: FormData | null;
} = {
  message: "",
  error: {},
  status: null,
  formData: null,
};
function Form({ translations }: { translations: Translations }) {
  const router = useRouter();
  const lang = useParams().lang;
  const [state, action, ispending] = useActionState(signup, initialState);
  const { getFormFields } = useFormFields({
    slug: Pages.Register,
    translations,
  });

  useEffect(() => {
    if(state.status && state.message) {
      if(state.status === 201) {
        toast.success(state.message, {
          className: "text-green-400!",
        });
      } else {
        toast.error(state.message, {
          className: "text-destructive!",
        });
      }
    }
    if(state.status === 201) {
      router.push(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`);
    }
  },[lang, router,state.status, state.message, ])

  return (
    <form action={action}>
      {getFormFields().map((field: IFormField) => {
        const fieldValue = state.formData?.get(field.name) as string;
        return (
          <div className="mb-3" key={field.name}>
            <FormFields
              {...field}
              error={state.error}
              defaultValue={fieldValue}
            />
          </div>
        );
      })}
      <Button type="submit" className="w-full" disabled={ispending}>
        {ispending ? <Loader /> : translations.auth.register.submit}
      </Button>
    </form>
  );
}

export default Form;
