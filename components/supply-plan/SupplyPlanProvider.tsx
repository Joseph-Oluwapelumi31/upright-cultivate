"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SupplyPlanItem = {
  id: string;
  name: string;
  quantity: number;
  unit: "kg";
};

type SupplyPlanContextType = {
  items: SupplyPlanItem[];
  addItem: (item: Omit<SupplyPlanItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearPlan: () => void;
  itemCount: number;
};

const STORAGE_KEY = "upright-supply-plan";

const SupplyPlanContext = createContext<
  SupplyPlanContextType | undefined
>(undefined);

function getStoredPlan(): SupplyPlanItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedPlan = window.localStorage.getItem(STORAGE_KEY);

    if (!storedPlan) {
      return [];
    }

    const parsedPlan: unknown = JSON.parse(storedPlan);

    if (!Array.isArray(parsedPlan)) {
      return [];
    }

    return parsedPlan;
  } catch (error) {
    console.error(
      "Failed to load supply plan from localStorage:",
      error
    );

    return [];
  }
}

export function SupplyPlanProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<SupplyPlanItem[]>(
    getStoredPlan
  );

  /*
   * Persist changes to localStorage.
   *
   * This effect only synchronizes React state
   * with the external storage system.
   */
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Failed to save supply plan to localStorage:",
        error
      );
    }
  }, [items]);

  const addItem = (
    item: Omit<SupplyPlanItem, "quantity">
  ) => {
    setItems((current) => {
      const exists = current.some(
        (existingItem) => existingItem.id === item.id
      );

      if (exists) {
        return current;
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearPlan = () => {
    setItems([]);
  };

  const itemCount = useMemo(
    () => items.length,
    [items]
  );

  return (
    <SupplyPlanContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearPlan,
        itemCount,
      }}
    >
      {children}
    </SupplyPlanContext.Provider>
  );
}

export function useSupplyPlan() {
  const context = useContext(SupplyPlanContext);

  if (!context) {
    throw new Error(
      "useSupplyPlan must be used inside SupplyPlanProvider"
    );
  }

  return context;
}