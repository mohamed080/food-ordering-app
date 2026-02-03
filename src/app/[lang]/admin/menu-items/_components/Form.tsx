"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button, buttonVariants } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import SelectedCategory from "./SelectedCategory";
import { Category, Extra, Size } from "@/generated/prisma";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ItemOptions, { ItemOptionsKeys } from "./ItemOptions";
import Link from "@/components/link";
import { useParams } from "next/navigation";
import { ValidationErrors } from "@/validations/auth";
import { addProduct, deleteProduct, updateProduct } from "../_actions/product";
import { toast } from "sonner";
import { ProductWithRelations } from "@/types/product";

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

function Form({
  translations,
  categories,
  product,
}: {
  translations: Translations;
  categories: Category[];
  product?: ProductWithRelations;
}) {
  const [selectedImage, setSelectedImage] = useState(
    product ? product.image : "",
  );
  const [categoryId, setCategoryId] = useState(
    product ? product.categoryId : categories[0].id,
  );
  const [sizes, setSizes] = useState<Partial<Size>[]>(
    product ? product.sizes : [],
  );
  const [extras, setExtras] = useState<Partial<Extra>[]>(
    product ? product.extras : [],
  );
  const formData = new FormData();

  Object.entries(product ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });

  const { getFormFields } = useFormFields({
    slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    translations,
  });

  const [state, action, isPending] = useActionState(
    product? updateProduct.bind(null, { productId: product.id, options: { sizes, extras } }) :
    addProduct.bind(null, { categoryId, options: { sizes, extras } }),
    initialState,
  );

  useEffect(() => {
    if (state.message && state.status && !isPending) {
      if (state.status === 201 || state.status === 200) {
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

  return (
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div>
        <UploadImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        {state?.error?.image && (
          <p className="text-sm text-destructive text-center mt-4 font-medium">
            {state.error?.image}
          </p>
        )}
      </div>
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          const fieldValue =
            state.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                error={state?.error}
                defaultValue={fieldValue as string}
              />
            </div>
          );
        })}
        <SelectedCategory
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          categories={categories}
          translations={translations}
        />
        <AddSize
          translations={translations}
          sizes={sizes}
          setSizes={setSizes}
        />
        <AddExtras
          translations={translations}
          extras={extras}
          setExtras={setExtras}
        />
        <FormActions
          translations={translations}
          isPending={isPending}
          product={product}
        />
      </div>
    </form>
  );
}

export default Form;

const UploadImage = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string;
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
    <div className="group mx-auto md:mx-0 relative w-50 h-50 overflow-hidden rounded-full">
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="Add Product Image"
          width={200}
          height={200}
          className="object-cover rounded-full"
        />
      )}
      <div
        className={`${
          selectedImage
            ? "group-hover:opacity-100 opacity-0 transition-opacity duration-200"
            : ""
        }
absolute inset-0 w-full h-full bg-gray-50/40`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
          name="image"
        />
        <label
          htmlFor="image-upload"
          className="border rounded-full w-50 h-50 element-center cursor-pointer"
        >
          <CameraIcon className="w-8! h-8! text-accent" />
        </label>
      </div>
    </div>
  );
};

const AddSize = ({
  translations,
  sizes,
  setSizes,
}: {
  translations: Translations;
  sizes: Partial<Size>[];
  setSizes: React.Dispatch<React.SetStateAction<Partial<Size>[]>>;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4"
    >
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translations.sizes}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            translations={translations}
            state={sizes}
            setState={setSizes}
            optionKey={ItemOptionsKeys.SIZES}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const AddExtras = ({
  translations,
  extras,
  setExtras,
}: {
  translations: Translations;
  extras: Partial<Extra>[];
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4"
    >
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translations.extrasIngredients}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            translations={translations}
            state={extras}
            setState={setExtras}
            optionKey={ItemOptionsKeys.EXTRAS}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
const FormActions = ({
  translations,
  isPending,
  product,
}: {
  translations: Translations;
  isPending: boolean;
  product?: ProductWithRelations;
}) => {
  const { lang } = useParams();
  const [state, setState] = useState<{
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });

  const handleDelete = async (id: string) => {
    try{
      setState((prev) => {
        return { ...prev, pending: true };
      })
      const res = await deleteProduct(id);
      setState((prev) => {
        return { ...prev, message: res.message, status: res.status };
      })
    }catch(err){
      console.log(err)
    } finally {
      setState((prev) => {
        return { ...prev, pending: false };
      })
    }
  };
  return (
    <>
      <div
        className={`${product ? "grid grid-cols-2" : "flex flex-col"} gap-4`}
      >
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader />
          ) : product ? (
            translations.save
          ) : (
            translations.create
          )}
        </Button>
        {product && (
          <Button
            variant="outline"
            disabled={state.pending}
            onClick={() => handleDelete(product.id)}
          >
            {state.pending ? <Loader /> : translations.delete}
          </Button>
        )}
      </div>
      <Link
        href={`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translations.cancel}
      </Link>
    </>
  );
};
