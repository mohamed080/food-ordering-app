"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "@/constants/enums";
import { Category } from "@/generated/prisma";
import { Translations } from "@/types/translations";
import { useParams } from "next/navigation";

function SelectedCategory({
  categoryId,
  setCategoryId,
  categories,
  translations,
}: {
  categoryId: string;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  translations: Translations;
  categories: Category[];
}) {
  const currentItem = categories.find((c) => c.id === categoryId);
  const { lang } = useParams();

  return (
    <>
      <Label htmlFor="categoryId" className="mb-3 text-black block">
        {translations.category}
      </Label>
      <Select
        name="categoryId"
        onValueChange={(value) => {
          setCategoryId(value);
        }}
        defaultValue={categoryId}
      >
        <SelectTrigger
          className={`w-48 h-10 bg-gray-100 border-0 mb-4 focus:ring-0 ${
            lang === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <SelectValue> {currentItem?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent className="border-0 z-50 bg-gray-100">
          <SelectGroup className="bg-transparent">
            {categories.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="hover:bg-primary! hover:text-white! text-accent!"
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export default SelectedCategory;
