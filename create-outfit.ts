export interface ClosetItem {
  id: number;
  type: string;
  name: string;
  imgUrl: string;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export interface itemByType {
  tops: ClosetItem[];
  bottoms: ClosetItem[];
  jumpsuits: ClosetItem[];
  dresses: ClosetItem[];
}

// This function receives a list of ALL possible items for a day
export const recommendOutfit = (closetItems: ClosetItem[]) => {
  //First find all closetItems available per type
  let { tops, bottoms, jumpsuits, dresses }: itemByType = closetItems.reduce(
    (result: itemByType, item: ClosetItem) => {
      if (item.type === "Tops") result.tops.push(item);
      else if (item.type === "Bottoms") result.bottoms.push(item);
      else if (item.type === "Jumpsuits") result.jumpsuits.push(item);
      else if (item.type === "Dresses") result.dresses.push(item);
      return result;
    },
    {
      tops: [],
      bottoms: [],
      jumpsuits: [],
      dresses: [],
    }
  );

  const choices = [];
  if (bottoms.length > 0 && tops.length > 0) {
    choices.push("bottom_top");
  }
  if (jumpsuits.length > 0) {
    choices.push("jumpsuits");
  }
  if (dresses.length > 0) {
    choices.push("dresses");
  }

  if (choices.length === 0) {
    return { items: [] };
  }

  const choice = choices[getRandomInt(choices.length)];

  if (choice === "bottom_top") {
    return {
      items: [
        tops[getRandomInt(tops.length)],
        bottoms[getRandomInt(bottoms.length)],
      ],
    };
  }
  if (choice === "jumpsuits") {
    return { items: [jumpsuits[getRandomInt(jumpsuits.length)]] };
  }
  if (choice === "dresses") {
    return { items: [dresses[getRandomInt(dresses.length)]] };
  }
  return { items: [] };
};
