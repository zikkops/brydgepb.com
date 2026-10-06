"use client";

import { useState } from "react";
import { INK } from "@/components/BarArt";
import { QuantityStepper } from "@/components/QuantityStepper";
import { cart } from "@/lib/cart";
import { MAX_QTY_PER_ITEM } from "@/lib/pricing";

export function ProductBuy({ slug, inStock, color, ink }: { slug: string; inStock: boolean; color: string; ink: "espresso" | "cream" }) {
  const [qty, setQty] = useState(1);
  const inkHex = INK[ink];
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <QuantityStepper value={qty} onChange={setQty} max={MAX_QTY_PER_ITEM} color={inkHex} label="Number of boxes" />
      <button
        type="button"
        disabled={!inStock}
        onClick={() => {
          cart.add(slug, qty);
          setQty(1);
        }}
        className="btn min-w-48"
        style={{ background: inkHex, color }}
      >
        {inStock ? "Add to cart" : "Sold out"}
      </button>
    </div>
  );
}
