// Simple ingredient illustrations that float around the bars. Decorative only.

export type IngredientKind = "almond" | "strawberry" | "chocolate" | "leaf" | "coconut";

export const INGREDIENTS_BY_FLAVOUR: Record<string, IngredientKind[]> = {
  almond: ["almond", "almond", "almond"],
  strawberry: ["strawberry", "strawberry", "leaf"],
  "dark-chocolate": ["chocolate", "chocolate", "chocolate"],
  "coconut-matcha": ["coconut", "leaf", "leaf"],
};

export function Ingredient({ kind, className }: { kind: IngredientKind; className?: string }) {
  switch (kind) {
    case "almond":
      return (
        <svg viewBox="0 0 60 80" className={className} aria-hidden>
          <path d="M30 4 C52 22 54 56 30 76 C6 56 8 22 30 4 Z" fill="#B07B4F" />
          <path d="M30 4 C52 22 54 56 30 76" fill="none" stroke="#8A5A35" strokeWidth="2" />
          <path d="M22 26 C24 40 24 52 22 62 M32 22 C35 38 35 54 32 66 M40 30 C41 42 41 50 39 58" stroke="#8A5A35" strokeWidth="1.4" fill="none" opacity="0.6" />
        </svg>
      );
    case "strawberry":
      return (
        <svg viewBox="0 0 70 80" className={className} aria-hidden>
          <path d="M35 76 C12 60 4 36 12 24 C20 14 30 20 35 22 C40 20 50 14 58 24 C66 36 58 60 35 76 Z" fill="#C4485B" />
          <path d="M35 22 L24 8 L33 16 L35 4 L38 16 L47 8 Z" fill="#7C8B55" />
          {[
            [24, 34], [36, 32], [48, 36], [20, 46], [32, 46], [44, 48], [28, 58], [40, 60], [34, 68],
          ].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.6" ry="2.6" fill="#F3D9A4" />
          ))}
        </svg>
      );
    case "chocolate":
      return (
        <svg viewBox="0 0 70 70" className={className} aria-hidden>
          <rect x="6" y="6" width="58" height="58" rx="6" fill="#3E2A20" />
          <rect x="14" y="14" width="42" height="42" rx="3" fill="#5A3C2C" />
          <path d="M14 14 L6 6 M56 14 L64 6 M14 56 L6 64 M56 56 L64 64" stroke="#2C1D15" strokeWidth="2" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 80 60" className={className} aria-hidden>
          <path d="M6 54 C10 20 40 4 74 6 C72 38 46 58 6 54 Z" fill="#7C8B55" />
          <path d="M8 52 C30 40 50 24 72 8" stroke="#5E6B3E" strokeWidth="2" fill="none" />
        </svg>
      );
    case "coconut":
      return (
        <svg viewBox="0 0 80 50" className={className} aria-hidden>
          <path d="M4 10 A36 36 0 0 0 76 10 Z" fill="#6B4A33" />
          <path d="M10 10 A30 30 0 0 0 70 10 Z" fill="#FBF7EF" />
          <rect x="4" y="6" width="72" height="5" rx="2.5" fill="#6B4A33" />
        </svg>
      );
  }
}
