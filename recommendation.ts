type Condition = "rain" | "snow" | string;

export const categoryRecommendation = (
  temperature: number,
  condition: Condition
) => {
  const matches = [];

  if (condition.includes("rain")) {
    matches.push("Raincoats");
  }
  if (condition.includes("snow")) {
    matches.push("Sweaters");
    matches.push("Knitwear");
  }
  if (0 < temperature && temperature < 10) {
    matches.push("Sweaters");
    matches.push("Jackets");
    matches.push("Coats");
    matches.push("Hoodies");
    matches.push("Knitwear");
    matches.push("Pants");
    matches.push("Jeans");
  }

  console.log(matches);
  if (10 < temperature && temperature < 20) {
    matches.push("Jeans");
    matches.push("Sweaters");
    matches.push("Jackets");
    matches.push("Coats");
    matches.push("Hoodies");
    matches.push("Knitwear");
    matches.push("Pants");
    matches.push("Sweatshirts");
  }
  if (20 < temperature && temperature < 30) {
    matches.push("Shorts");
    matches.push("Maxi");
    matches.push("Midi");
    matches.push("Short");
    matches.push("Skirts");
    matches.push("Actives");
    matches.push("Leggings");
    matches.push("Hoodies");
    matches.push("Blazers");
    matches.push("Tanks");
    matches.push("Blouses");
    matches.push("T-shirts");
  }
  if (temperature > 30) {
    matches.push("Tanks");
    matches.push("Shorts");
    matches.push("Short");
    matches.push("Skirts");
    matches.push("Blouses");
  }

  return matches;
};
