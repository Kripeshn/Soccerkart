import { useCallback } from "react";
import toastr from "toastr";
import { useCart } from "../../context/cart";

/**
 * One place that adds to the cart AND persists it to localStorage
 * (the product detail page used to skip the persist step, losing the cart on refresh).
 * The cart is a flat array; quantity = how many times a product appears.
 */
export default function useAddToCart() {
  const [cart, setCart] = useCart();

  return useCallback(
    (product, count = 1) => {
      const next = [...cart, ...Array.from({ length: count }, () => product)];
      setCart(next);
      localStorage.setItem("cart", JSON.stringify(next));
      toastr.success(count > 1 ? `${count} items added to cart` : "Item added to cart");
    },
    [cart, setCart]
  );
}
