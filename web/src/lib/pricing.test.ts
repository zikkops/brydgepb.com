import { describe, expect, it } from "vitest";
import { calculateTotals, formatMoney, isValidQuantity, MAX_QTY_PER_ITEM } from "./pricing";

const settings = { currency: "USD", deliveryFee: 3, freeDeliveryOver: 60 };

describe("calculateTotals", () => {
  it("adds the delivery fee under the free-delivery threshold", () => {
    expect(calculateTotals([{ unitPrice: 30, quantity: 1 }], settings)).toEqual({ subtotal: 30, deliveryFee: 3, total: 33 });
  });

  it("delivers free at exactly the threshold", () => {
    expect(calculateTotals([{ unitPrice: 30, quantity: 2 }], settings)).toEqual({ subtotal: 60, deliveryFee: 0, total: 60 });
  });

  it("sums several lines", () => {
    const t = calculateTotals(
      [
        { unitPrice: 30, quantity: 1 },
        { unitPrice: 12.5, quantity: 2 },
      ],
      settings,
    );
    expect(t).toEqual({ subtotal: 55, deliveryFee: 3, total: 58 });
  });

  it("never charges delivery on an empty cart", () => {
    expect(calculateTotals([], settings)).toEqual({ subtotal: 0, deliveryFee: 0, total: 0 });
  });

  it("always charges delivery when there is no threshold", () => {
    const t = calculateTotals([{ unitPrice: 30, quantity: 10 }], { ...settings, freeDeliveryOver: null });
    expect(t).toEqual({ subtotal: 300, deliveryFee: 3, total: 303 });
  });

  it("has no floating point drift", () => {
    const t = calculateTotals([{ unitPrice: 0.1, quantity: 3 }], { ...settings, deliveryFee: 0.2 });
    expect(t).toEqual({ subtotal: 0.3, deliveryFee: 0.2, total: 0.5 });
  });
});

describe("isValidQuantity", () => {
  it("accepts whole numbers from 1 to the limit", () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(MAX_QTY_PER_ITEM)).toBe(true);
  });

  it("rejects zero, negatives, fractions, too many and non-numbers", () => {
    for (const q of [0, -1, 1.5, MAX_QTY_PER_ITEM + 1, "2", null, NaN]) expect(isValidQuantity(q)).toBe(false);
  });
});

describe("formatMoney", () => {
  it("drops cents on whole amounts", () => {
    expect(formatMoney(30)).toBe("$30");
    expect(formatMoney(12.5)).toBe("$12.50");
  });
});
