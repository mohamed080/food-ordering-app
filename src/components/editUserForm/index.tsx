/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { InputTypes, Routes } from "@/constants/enums";
import { UserRole } from "@/generated/prisma";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import Checkbox from "../form-fields/checkbox";
import { ValidationErrors } from "@/validations/auth";
import { updateProfile } from "./_actions/profile";
import Loader from "../ui/Loader";
import { CameraIcon } from "lucide-react";
import { toast } from "sonner";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

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
function EditUserForm({
  user,
  translations,
}: {
  user: Session["user"];
  translations: Translations;
}) {
  const session = useSession();
  const formData = new FormData();
  Object.entries(user).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });
  const [selectedImage, setSelectedImage] = useState(user.image ?? "");
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);

  const [state, action, isPending] = useActionState(
    updateProfile.bind(null, isAdmin),
    initialState,
  );
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations,
  });

  useEffect(() => {
    if (state.message && state.status && !isPending) {
      if (state.status === 200) {
        toast.success(state.message, {
          className: "text-green-400!",
        });
      } else {
        toast.error(state.message, {
          className: "text-destructive!",
        });
      }
    }
  }, [state.message, state.status, isPending]);

  useEffect(() => {
    setSelectedImage(user.image as string);
  }, [user.image]);

  return (
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div className="group relative w-50 h-50 overflow-hidden rounded-full mx-auto">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={user.name}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        )}

        <div
          className={`${
            selectedImage
              ? "group-hover:opacity-100 opacity-0 transition-opacity duration-200"
              : ""
          }
        absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
          <UploadImage setSelectedImage={setSelectedImage} />
        </div>
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          const fieldValue =
            state?.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div className="mb-3" key={field.name}>
              <FormFields
                {...field}
                defaultValue={fieldValue as string}
                error={state?.error}
                readOnly={field.type === InputTypes.EMAIL}
                disabled={isPending}
              />
            </div>
          );
        })}
        {session.data?.user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4">
            <Checkbox
              label="Admin"
              name="isAdmin"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
            />
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader /> : translations.save}
        </Button>
      </div>
    </form>
  );
}

export default EditUserForm;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="border rouneded-full w-50 h-50 element-center cursor-pointer"
      >
        <CameraIcon className="w-8! h-8! text-accent" />
      </label>
    </>
  );
};
