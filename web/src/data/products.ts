// The four Brydge flavours, one per colour in the brand palette (24 Sep 2026).
// This is the seed for the `products` table (npm run db:seed-sql) and what the
// shop shows until Supabase is connected.
//
// PLACEHOLDER: prices, taglines, descriptions and nutrition numbers are made
// up until the owner sends the real ones (UPGRADE.md P4.2). The one exception:
// Almond's protein (15g) and calories (180) come from the real wrapper.

export type Nutrition = {
  protein: number; // grams per bar
  calories: number;
  carbs: number;
  sugar: number;
  fat: number;
  fibre: number;
};

export type ProductSeed = {
  slug: string;
  name: string;
  tagline: string; // the palette's two-word line, e.g. "Natural & nutty"
  description: string;
  color: string; // flavour colour from the palette
  ink: "espresso" | "cream"; // readable text colour on top of `color`
  price: number; // per box, in USD
  barsPerBox: number;
  weightGrams: number; // per bar
  nutrition: Nutrition;
  ingredients: string;
  sortOrder: number;
};

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "almond",
    name: "Almond",
    tagline: "Natural & nutty",
    description:
      "Roasted almonds folded into a soft, chewy base with a toasted-nut finish. The everyday bar: steady energy that keeps you going between meetings, workouts and everything in between.",
    color: "#CEA67D",
    ink: "espresso",
    price: 30,
    barsPerBox: 12,
    weightGrams: 60,
    nutrition: { protein: 15, calories: 180, carbs: 21, sugar: 3, fat: 8, fibre: 6 },
    ingredients: "Milk protein blend, almonds, almond butter, soluble fibre, cocoa butter, sea salt.",
    sortOrder: 1,
  },
  {
    slug: "strawberry",
    name: "Strawberry",
    tagline: "Fruity & vibrant",
    description:
      "Real strawberry pieces in a creamy, bright bar that tastes like dessert and works like fuel. For the afternoon slump, the post-run cool-down, the moment you want something sweet that's still on plan.",
    color: "#A04150",
    ink: "cream",
    price: 30,
    barsPerBox: 12,
    weightGrams: 60,
    nutrition: { protein: 20, calories: 210, carbs: 22, sugar: 4, fat: 7, fibre: 6 },
    ingredients: "Milk protein blend, freeze-dried strawberries, white chocolate coating, soluble fibre, natural flavouring.",
    sortOrder: 2,
  },
  {
    slug: "dark-chocolate",
    name: "Dark Chocolate",
    tagline: "Rich & indulgent",
    description:
      "Deep cocoa, a fudgy middle and dark chocolate chunks. The one you'll reach for when you've earned it, and the one that makes an early start feel less early.",
    color: "#556A78",
    ink: "cream",
    price: 30,
    barsPerBox: 12,
    weightGrams: 60,
    nutrition: { protein: 21, calories: 230, carbs: 20, sugar: 2, fat: 9, fibre: 7 },
    ingredients: "Milk protein blend, dark chocolate (70% cocoa), cocoa powder, soluble fibre, cocoa butter, sea salt.",
    sortOrder: 3,
  },
  {
    slug: "coconut-matcha",
    name: "Coconut Matcha",
    tagline: "Fresh & balanced",
    description:
      "Ceremonial-grade matcha meets toasted coconut for a clean, lightly sweet bar with a gentle lift. Calm focus in your bag, wherever the day takes you.",
    color: "#9EA488",
    ink: "espresso",
    price: 30,
    barsPerBox: 12,
    weightGrams: 60,
    nutrition: { protein: 19, calories: 215, carbs: 20, sugar: 3, fat: 9, fibre: 6 },
    ingredients: "Milk protein blend, desiccated coconut, matcha green tea powder, soluble fibre, coconut oil.",
    sortOrder: 4,
  },
];

// PLACEHOLDER delivery settings (seed for the `settings` table).
export const DEFAULT_SETTINGS = {
  currency: "USD",
  deliveryFee: 3,
  freeDeliveryOver: 60 as number | null, // null = never free
};

// PLACEHOLDER contact details until the owner sends the real ones.
export const CONTACT = {
  phone: "+961 70 000 000",
  whatsapp: "96170000000",
  email: "hello@brydge.com",
  instagram: "brydge.bars",
  area: "Beirut, Lebanon",
};
