export interface ClosetItem {
  id: number;
  type: string;
  name: string;
  imgUrl: string;
}

export const recommendOutfit = (closetItems: ClosetItem[]) => {
  //First find all closetItems available per type
  let [tops, bottoms, jumpsuits, dresses]: ClosetItem[][] = closetItems.reduce(
    (result: ClosetItem[][], item: ClosetItem) => {
      if (item.type === "Tops") result[0].push(item);
      else if (item.type === "Bottoms") result[1].push(item);
      else if (item.type === "Jumpsuits") result[2].push(item);
      else if (item.type === "Dresses") result[3].push(item);
      return result;
    },
    [[], [], [], []]
  );

  // Start with the most available option:
  const topBottomlenght = Math.min(tops.length, bottoms.length);
  if (dresses.length === 0 && jumpsuits.length === 0 && topBottomlenght === 0) {
    return { items: [] };
  }

  if (
    jumpsuits.length >= dresses.length &&
    jumpsuits.length >= topBottomlenght
  ) {
    return { items: [jumpsuits[Math.random() * jumpsuits.length].id] };
  }
  //if option order: jumpsuit>dress>topbottom, jumpsuit first
  //choose one item with random.id

  if (dresses.length >= jumpsuits.length && dresses.length >= topBottomlenght) {
    return { items: [dresses[Math.random() * dresses.length].id] };
    //if option order: dress>jumpsuit>topbottom, dress first
  } else if (tops.length > 0 && bottoms.length > 0) {
    // There is at least one top one bottom
    return {
      items: [
        tops[Math.random() * tops.length].id,
        bottoms[Math.random() * bottoms.length].id,
      ],
    };
  } else return { items: [] }; // Empty array since no cloths were found for outfit
};
