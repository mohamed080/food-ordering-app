"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@/generated/prisma";
import { Translations } from "@/types/translations";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { Languages } from "@/constants/enums";

export enum ItemOptionsKeys {
  SIZES,
  EXTRAS,
}

const sizesNames = [
  ProductSizes.SMALL,
  ProductSizes.MEDIUM,
  ProductSizes.LARGE,
];

const extrasNames = [
  ExtraIngredients.CHEESE,
  ExtraIngredients.BACON,
  ExtraIngredients.TOMATO,
  ExtraIngredients.ONION,
  ExtraIngredients.PEPPER,
];

function handleOptions(
  setState:
    | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>
) {
  const addOption = () => {
    setState((prev: any) => [
      ...prev,
      {
        name: "",
        price: 0,
      },
    ]);
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: string
  ) => {
    const newValue = e.target.value;
    setState((prev: any) => {
      const newSizes = [...prev];
      newSizes[index][fieldName] = newValue;
      return newSizes;
    });
  };

  const removeOption = (indexToRemove: number) => {
    setState((prev: any) => {
      return prev.filter((_: any, index: number) => index !== indexToRemove);
    });
  };

  return { addOption, onChange, removeOption };
}

function ItemOptions({
  translations,
  state,
  setState,
  optionKey,
}: {
  translations: Translations;
  state: Partial<Size>[] | Partial<Extra>[];
  setState:
    | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  optionKey: ItemOptionsKeys;
}) {
  const { addOption, onChange, removeOption } = handleOptions(setState);

  const availableOptions = () => {
    switch (optionKey) {
      case ItemOptionsKeys.SIZES:
        return sizesNames.length > state.length;
      case ItemOptionsKeys.EXTRAS:
        return extrasNames.length > state.length;
    }
  };

  return (
    <>
      {state.length > 0 && (
        <ul>
          {state.map((option, index) => (
            <li key={index} className="flex gap-2 mb-2">
              <div className="space-y-1 basis-1/2">
                <Label>NAME</Label>
                <SelectName
                  item={option}
                  onChange={onChange}
                  index={index}
                  currentState={state}
                  optionKey={optionKey}
                />
              </div>
              <div className="space-y-1 basis-1/2">
                <Label>Extra Price</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  name="price"
                  value={option.price}
                  onChange={(e) => onChange(e, index, "price")}
                  className="bg-white focus:ring-0!"
                />
              </div>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {availableOptions() && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addOption}
        >
          <Plus />
          {optionKey === ItemOptionsKeys.SIZES
            ? translations.admin["menu-items"].addItemSize
            : translations.admin["menu-items"].addExtraItem}
        </Button>
      )}
    </>
  );
}

export default ItemOptions;

const SelectName = ({
  item,
  index,
  onChange,
  currentState,
  optionKey,
}: {
  item: Partial<Size> | Partial<Extra>;
  index: number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: string
  ) => void;
  currentState: Partial<Size>[] | Partial<Extra>[];
  optionKey: ItemOptionsKeys;
}) => {
  const { lang } = useParams();
  const getNames = () => {
    switch (optionKey) {
      case ItemOptionsKeys.SIZES:
        const filterSizes = sizesNames.filter(
          (size) => !currentState.some((s) => s.name === size)
        );
        return filterSizes;
      case ItemOptionsKeys.EXTRAS:
        const filterExtras = extrasNames.filter(
          (extra) => !currentState.some((e) => e.name === extra)
        );
        return filterExtras;
    }
  };
  const names = getNames();
  return (
    <Select
      name="categoryId"
      onValueChange={(value) => {
        onChange(
          { target: { value } } as React.ChangeEvent<HTMLInputElement>,
          index,
          "name"
        );
      }}
      defaultValue={item.name ? item.name : "select..."}
    >
      <SelectTrigger
        className={`bg-white border-0 mb-4 focus:ring-0 w-full ${
          lang === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <SelectValue> {item.name ? item.name : "select..."}</SelectValue>
      </SelectTrigger>
      <SelectContent className="border-0 z-50 bg-gray-100">
        <SelectGroup className="bg-transparent">
          {names.map((name, index) => (
            <SelectItem
              key={index}
              value={name}
              className="hover:bg-primary! hover:text-white! text-accent!"
            >
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
