"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/formatters";
import { Checkbox } from "@/components/ui/checkbox";
import { Extra, ProductSizes, Size } from "@/generated/prisma";
import { ProductWithRelations } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCart,
  removeFromCart,
  removeItemfromCart,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { useState } from "react";
import { getItemQuantity } from "@/lib/cart";

function AddToCartButton({ item }: { item: ProductWithRelations }) {
  const cart = useAppSelector(selectCartItems);
  const quantity = getItemQuantity(cart, item.id);
  const dispatch = useAppDispatch();

  const defaultSize =
    cart.find((el) => el.id === item.id)?.size ||
    item.sizes.find((size) => size.name === ProductSizes.SMALL);
  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!);
  const defaultExtras = cart.find((el) => el.id === item.id)?.extras || [];

  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras);

  let totalPrice = item.basePrice;
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        basePrice: item.basePrice,
        id: item.id,
        image: item.image,
        name: item.name,
        size: selectedSize,
        extras: selectedExtras,
      })
    );
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="lg"
            className="mt-4 text-white rounded-full px-8!"
            // onClick={}
          >
            Add to Cart
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25 max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex items-center">
            <Image src={item.image} alt={item.name} width={200} height={200} />
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>{item.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <Label htmlFor="Pick-size" className="justify-center">
                Pick your size
              </Label>
              <PickSize
                sizes={item.sizes}
                item={item}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            </div>
            <div className="space-y-10">
              <Label htmlFor="add-extras" className="justify-center">
                Any extras?
              </Label>
              <Extras
                extras={item.extras}
                selectedExtras={selectedExtras}
                setSelectedExtras={setSelectedExtras}
              />
            </div>
          </div>
          <DialogFooter>
            {quantity === 0 ? (
              <Button
                type="submit"
                onClick={handleAddToCart}
                className="w-full h-10"
              >
                Add to cart {formatCurrency(totalPrice)}
              </Button>
            ) : (
              <ChooseQuantity
                quantity={quantity}
                item={item}
                selectedSize={selectedSize}
                selectedExtras={selectedExtras}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function PickSize({
  sizes,
  item,
  selectedSize,
  setSelectedSize,
}: {
  sizes: Size[];
  item: ProductWithRelations;
  selectedSize: Size;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
}) {
  return (
    <RadioGroup>
      {sizes.map((size) => (
        <div
          key={size.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <RadioGroupItem
            value={selectedSize.name}
            checked={selectedSize.id === size.id}
            onClick={() => setSelectedSize(size)}
            id={size.id}
          />
          <Label htmlFor={size.id}>
            {size.name} {formatCurrency(item.basePrice + size.price)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
}) {
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      const filterSelectedExtras = selectedExtras.filter(
        (e) => e.id !== extra.id
      );
      setSelectedExtras(filterSelectedExtras);
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      {extras.map((extra) => (
        <div
          key={extra.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <Checkbox
            id={extra.id}
            // value={selectedExtras.name}
            checked={Boolean(selectedExtras.find((e) => e.id === extra.id))}
            onClick={() => handleExtra(extra)}
          />
          <Label
            htmlFor={extra.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
            {extra.name} {formatCurrency(extra.price)}
          </Label>
        </div>
      ))}
    </div>
  );
}

const ChooseQuantity = ({
  quantity,
  item,
  selectedSize,
  selectedExtras,
}: {
  quantity: number;
  item: ProductWithRelations;
  selectedSize: Size;
  selectedExtras: Extra[];
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              removeFromCart({
                id: item.id,
              })
            )
          }
        >
          -
        </Button>
        <div>
          <span className="text-black">{quantity} in cart</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              addToCart({
                basePrice: item.basePrice,
                id: item.id,
                image: item.image,
                name: item.name,
                extras: selectedExtras,
                size: selectedSize,
                quantity: 1,
              })
            )
          }
        >
          +
        </Button>
      </div>
      <Button size="sm" onClick={() => dispatch(removeItemfromCart({id: item.id}))}>Remove</Button>
    </div>
  );
};
export default AddToCartButton;
