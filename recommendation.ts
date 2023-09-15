type Condition = "rain" | "snow" | string;

export const categoryRecommendation = (
  temperature: number,
  condition: Condition
) => {
  const matches = [];

  if (condition.includes("rain")) {
    matches.push("Raincoat");
  }
  if (condition.includes("snow")) {
    matches.push("Sweater");
    matches.push("Knitwear");
  }
  if (0 < temperature && temperature < 10) {
    matches.push("Sweater");
    matches.push("Jacket");
    matches.push("Coat");
    matches.push("Hoodie");
    matches.push("Knitwear");
    matches.push("Pants");
    matches.push("Jeans");
    matches.push("Sweatpants");
  }

  if (10 < temperature && temperature < 20) {
    matches.push("Jeans");
    matches.push("Sweater");
    matches.push("Jacket");
    matches.push("Coat");
    matches.push("Hoodie");
    matches.push("Knitwear");
    matches.push("Pants");
    matches.push("Sweatshirt");
    matches.push("Sweatpants");
  }
  if (20 < temperature && temperature < 30) {
    matches.push("Shorts");
    matches.push("Maxi");
    matches.push("Midi");
    matches.push("Short");
    matches.push("Skirt");
    matches.push("Active");
    matches.push("Leggings");
    matches.push("Blazer");
    matches.push("Tank");
    matches.push("Blouse");
    matches.push("T-shirt");
    matches.push("Jumpsuit");
    matches.push("Jeans");
    matches.push("Pants");
    matches.push("Sweatpants");
  }
  if (temperature > 30) {
    matches.push("Tank");
    matches.push("T-shirt");
    matches.push("Shorts");
    matches.push("Short");
    matches.push("Skirt");
    matches.push("Blouse");
    matches.push("Maxi");
    matches.push("Midi");
  }

  return matches;
};
