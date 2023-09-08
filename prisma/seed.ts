import users from "../prisma/data/users.json";
import closets from "../prisma/data/closets.json";
import closetitems from "../prisma/data/closetitems.json";
import outfits from "../prisma/data/outfits.json";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i];
    await prisma.users.create({
      data: {
        username: currentUser.username,
        password: bcrypt.hashSync(currentUser.password,10)
      },
    });
  }

  for (let i = 0; i < closets.length; i++) {
    const currentCloset = closets[i];
    await prisma.closet.create({
      data: {
        userId: currentCloset.userId,

      },
    });
  }

  for (let i = 0; i < outfits.length; i++) {
    const currentOutfit = outfits[i];
    await prisma.outfits.create({
      data: {
        userId: currentOutfit.userId,
      },
    });
  }

  for (let i = 0; i < closetitems.length; i++) {
    const currentClosetItems = closetitems[i];
    await prisma.closetitems.create({
      data: {
        closetId: currentClosetItems.closetId,
        outfitId: currentClosetItems.outfitId,
        type: currentClosetItems.type,
        name: currentClosetItems.name,
        imgUrl: currentClosetItems.imgUrl,
      },
    });
  }

  
};

seed();
