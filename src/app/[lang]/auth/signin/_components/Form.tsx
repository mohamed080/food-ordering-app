"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

function Form({ translations }: { translations: Translations }) {
  const router = useRouter();
  const lang = useParams().lang;
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { getFormFields } = useFormFields({
    slug: Pages.LOGIN,
    translations,
  });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // value
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        const validtionError = JSON.parse(res?.error).validationError;
        setError(validtionError);
        const responseError = JSON.parse(res?.error).responseError;
        if (responseError) {
          toast.error(responseError, {
            className: "text-destructive!",
          });
        }
      }
      if (res?.ok) {
        toast.success(translations.messages.loginSuccessful,{
            className: "text-green-400!",
        });
        router.push(`/${lang}/${Routes.PROFILE}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmit} ref={formRef}>
      {getFormFields().map((field: IFormField) => (
        <div className="mb-3" key={field.name}>
          <FormFields {...field} error={error} />
        </div>
      ))}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader /> : translations.auth.login.submit}
      </Button>
    </form>
  );
}

export default Form;
