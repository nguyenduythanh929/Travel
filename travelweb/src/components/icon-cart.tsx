"use client";
import { useAppContext } from "@/app/AppProvider";
import Image from "next/image";
import { usecart } from "@/store/cart";
import { useEffect, useState } from "react";

export default function IconCard() {
const { userId } = useAppContext();
const [cartitem , setCartitem] =useState()
  // const hasHydrated = usecart((s) => s.hasHydrated);
  const cart = usecart((state) => state.cart);
  const fetchCart = usecart((state) => state.fetchCart);

//  useEffect(() => {
//   if (!userId) return;
//   fetchCart(parseInt(userId));
//   setCartitem(cart)
// }, [userId]);

console.log("cartitem",cartitem)

  
  return (
    <>
      <Image src={"/icon-cart.svg"} alt="logo-cart" width={24} height={24} />
    </>
  );
}
