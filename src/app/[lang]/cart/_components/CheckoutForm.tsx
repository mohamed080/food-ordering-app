"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { getTotalAmount } from "@/lib/cart";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems } from "@/redux/features/cart/cartSlice";

function CheckoutForm() {
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);

  return (
    cart &&
    cart.length > 0 && (
      <div className="grid gap-6 bg-gray-100 rounded-md p-4">
        <h2 className="text-2xl text-black font-semibold">CheckoutForm</h2>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="phone" className="text-accent">
                Phone
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="Enter your phone number"
                name="phone"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="address" className="text-accent">
                Street address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                name="address"
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
         <div>
               <Label htmlFor="postalcode" className="text-accent">
                 Postal Code
               </Label>
               <Input
                 id="postalcode"
                 type="text"
                 placeholder="Enter postal code"
                 name="postalcode"
               />
         </div>
          <div>
                <Label htmlFor="city" className="text-accent">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  name="city"
                />
          </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="country" className="text-accent">
                Country
              </Label>
              <Input
                id="country"
                type="text"
                placeholder="Enter your country"
                name="country"
              />
            </div>
            <Button className="h-10">Pay {formatCurrency(totalAmount)}</Button>
          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
