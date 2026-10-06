"use client";

import type { CSSProperties, ReactNode } from "react";
import { cart } from "@/lib/cart";

export function AddToCartButton({
  slug,
  quantity = 1,
  inStock = true,
  className = "btn btn-dark",
  style,
  children = "Add to cart",
}: {
  slug: string;
  quantity?: number;
  inStock?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <button type="button" className={className} style={style} disabled={!inStock} onClick={() => cart.add(slug, quantity)}>
      {inStock ? children : "Sold out"}
    </button>
  );
}
