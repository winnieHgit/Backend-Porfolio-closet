export type Type = "Tops" | "Bottoms" | "Jumpsuits" | "Dresses";
export type Name =
  | "Blouses"
  | "Tanks"
  | "T-shirt"
  | "Actives"
  | "Hoodies"
  | "Sweatshirts"
  | "Sweaters"
  | "Blazers"
  | "Coats"
  | "Raincoats"
  | "Jackets"
  | "Jeans"
  | "Shorts"
  | "Sweatpants"
  | "Leggings"
  | "Actives"
  | "Pants"
  | "Skirts"
  | "Jumpsuits"
  | "Maxi"
  | "Midi"
  | "Short"
  | "Knitwear";

export const mapCategoryToType: Record<Name, Type> = {
  Blouses: "Tops",
  Tanks: "Tops",
  "T-shirt": "Tops",
  Actives: "Tops",
  Hoodies: "Tops",
  Sweatshirts: "Tops",
  Sweaters: "Tops",
  Blazers: "Tops",
  Coats: "Tops",
  Raincoats: "Tops",
  Jackets: "Tops",
  Jeans: "Bottoms",
  Shorts: "Bottoms",
  Sweatpants: "Bottoms",
  Leggings: "Bottoms",
  Pants: "Bottoms",
  Skirts: "Bottoms",
  Jumpsuits: "Jumpsuits",
  Maxi: "Dresses",
  Midi: "Dresses",
  Short: "Dresses",
  Knitwear: "Dresses",
};
