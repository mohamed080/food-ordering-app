import { CartItem } from "@/redux/features/cart/cartSlice";

export const deliveryFee = 5.99;

export const getCartQuantity = (cart: CartItem[]) => {
  return cart.reduce((total, item) => total + item.quantity!, 0);
};

export const getItemQuantity = (cart: CartItem[], id: string) => {
  const item = cart.find((item) => item.id === id);
  return item ? item.quantity : 0;
};

export const getSubTotal = (cart: CartItem[]) => {
  return cart.reduce((total, cartItem) =>{
    const extrasTotal = cartItem.extras?.reduce((sum, extra) => sum + (extra.price || 0), 0);
    const itemTotal = cartItem.basePrice + (cartItem.size?.price || 0) + (extrasTotal || 0);
    return total + (itemTotal * cartItem.quantity!);
  }, 0);
};

export const getTotalAmount = (cart: CartItem[]) => {
  return getSubTotal(cart) + deliveryFee;
};