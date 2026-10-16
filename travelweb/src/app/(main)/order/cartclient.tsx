"use client";
import { BACKEND_URL } from "@/lib/backend";

import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@/app/AppProvider";
import CartSummary from "@/app/(main)/order/cartsummary";
import PaymentForm from "@/app/(main)/order/inforcleint";

interface CartItem {
  id: number;
  cartId: number;
  tourId: number;
  tourName: string;
  tourAvatar: string;
  tourDuration: number;
  adultCount: number;
  childCount: number;
  infantCount: number;
  departureDate: number[];
  departureLocation: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  subtotal: number;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
  remainAdult: number;
  remainChild: number;
  remainInfant: number;
  isAvailable: boolean;
}

interface CartData {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export default function CartClient() {
  const { userId } = useAppContext();

  const [items, setItems] = useState<CartItem[] | null>(null);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  async function loadData() {
    const res = await fetch(
      `${BACKEND_URL}/api/cart/user/${userId}`,
      { cache: "no-store", credentials: "include" }
    );
    const result: CartData = await res.json();
    setItems(result.items);
    setCartData(result);
    // Auto-select all items on initial load
    if (result.items && result.items.length > 0) {
      setSelectedIds(new Set(result.items.map((item) => item.id)));
    }
  }

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  // Toggle single item selection
  const toggleItemSelection = (itemId: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select all items
  const selectAll = () => {
    if (items) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  // Deselect all items
  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  // Check if all items are selected
  const allSelected = useMemo(() => {
    if (!items || items.length === 0) return false;
    return items.every((item) => selectedIds.has(item.id));
  }, [items, selectedIds]);

  // Get selected items
  const selectedItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => selectedIds.has(item.id));
  }, [items, selectedIds]);

  // Calculate total of selected items
  const selectedTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [selectedItems]);

  console.log("cartData", cartData);
  console.log("selectedIds", selectedIds);

  return (
    <>
      <CartSummary
        data={items}
        cartData={cartData}
        onRefresh={loadData}
        selectedIds={selectedIds}
        onToggleSelection={toggleItemSelection}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        allSelected={allSelected}
        selectedTotal={selectedTotal}
      />
      <PaymentForm
        cartData={cartData}
        selectedItemIds={Array.from(selectedIds)}
        selectedTotal={selectedTotal}
      />
    </>
  );
}
