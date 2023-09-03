import express, { request, response } from "express";
import { json } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";
import { toToken } from "./auth/jwt";
import { z } from "zod";
import { categoryRecommendation } from "./recommendation";
import { mapCategoryToType, Name, Type } from "./type-category-match";
import axios from "axios";
import apiKeys from "./secrets/APIKEYs.json";

const app = express();

app.use(json());
app.use(cors());
const port = 3007;

const prisma = new PrismaClient();

app.listen(port, () => {
  console.log(`⚡ Listening on port: ${port}`);
});

//POST "/signup"
const SignUpValidator = z.object({
  username: z.string().min(5),
  password: z.string().min(10),
});

app.post("/signup", async (request, response) => {
  const requestBody = request.body;
  const parsedBody = SignUpValidator.safeParse(requestBody);
  if (parsedBody.success) {
    try {
      const newUser = await prisma.users.create({
        data: parsedBody.data,
      });
      response.status(201).send(newUser);
    } catch (error) {
      response.status(500).send({ message: "Something went wrong" });
    }
  } else {
    response.status(400).send(parsedBody.error.flatten());
  }
});

//GET user
app.get("/users", async (request, response) => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
    },
  });
  response.send(users);
});

//POST "/login"
const LoginFormValidator = z
  .object({
    username: z.string().nonempty().min(5),
    password: z.string().min(10),
  })
  .strict();

app.post("/login", async (request, response) => {
  const requestBody = request.body;
  const parsedBody = LoginFormValidator.safeParse(requestBody);

  if (parsedBody.success) {
    try {
      const userToLogin = await prisma.users.findUnique({
        where: {
          username: requestBody.username,
        },
      });
      if (userToLogin && userToLogin.password === requestBody.password) {
        const token = toToken({ userId: userToLogin.id });
        response.status(200).send({ token: token });
        return;
      }
      // If we didn't find the user or the password doesn't match, send back an error message
      response.status(400).send({ message: "Login failed" });
    } catch (error) {
      // If we get an error, send back HTTP 500 (Server Error)
      response.status(500).send({ message: "Something went wrong!" });
    }
  } else {
    response.status(400).send(parsedBody.error.flatten());
  }
});

//-----------------------------------////-----------------------------------////-----------------------------------////-----------------------------------////-----------------------------------//
//GET "/mycloset"
app.get("/mycloset", AuthMiddleware, async (request: AuthRequest, response) => {
  const requestUser = request.userId;
  const allClosetitems = await prisma.closet.findFirst({
    where: {
      userId: requestUser,
    },
    select: {
      id: true,
      userId: true,
      items: {
        select: {
          id: true,
          type: true,
          name: true,
          imgUrl: true,
        },
      },
    },
  });
  response.send(allClosetitems);
});

//POST "/mycloset/add-closet-item

const addItemValidator = z.object({
  closetId: z.number(),
  name: z.custom<Name>(),
  imgUrl: z.string(),
});
type addItem = z.infer<typeof addItemValidator>;

app.post(
  "/mycloset/add-closet-item",
  AuthMiddleware,
  async (request: AuthRequest, response) => {
    console.log(request.body);
    const parsedBody = addItemValidator.safeParse(request.body);

    if (!parsedBody.success) {
      response.status(400).send({
        message: "Error parsing request body",
        errors: parsedBody.error,
      });
    } else {
      await prisma.closetitems.create({
        data: {
          closetId: parsedBody.data.closetId,
          type: mapCategoryToType[parsedBody.data.name],
          name: parsedBody.data.name,
          imgUrl: parsedBody.data.imgUrl,
        },
      });

      response.status(201).send({ message: "New Item created!" });
    }
  }
);

//DELETE  "/mycloset/items/:id"

app.delete("/mycloset/items/:id", AuthMiddleware, async (request:AuthRequest, response) => {
  const itemId = parseInt(request.params.id);
  try {
    await prisma.closetitems.delete({
      where: {
        id: itemId,
      },
    });
    response.status(200).send({ message: "Item Deleted!" });
  } catch (error) {
    // If we get an error, send back HTTP 500 (Server Error)
    response.status(500).send({ message: "Something went wrong!" });
  }
});

//GET "/mycloset/items/:id",
app.get(
  "/mycloset/items/:id",
  AuthMiddleware,
  async (request: AuthRequest, response) => {
    const itemId = request.params.id;
    const requestUser = request.userId;

    if (!requestUser) {
      response.status(500).send({ message: `something went wrong` });
      return;
    }

    const closetItem = await prisma.closetitems.findFirst({
      where: {
        id: parseInt(itemId),
        closet: {
          userId: requestUser,
        },
      },
      select: {
        id: true,
        type: true,
        name: true,
        imgUrl: true,
      },
    });

    if (closetItem) {
      response.send(closetItem);
    } else {
      response.status(404).send({ message: "Item not found" });
    }
  }
);

//DELETE "/mycloset/items/:id"
app.delete("/mycloset/items/:id", async (request:AuthRequest, response) => {
  const itemId = request.params.id;
    const requestUser = request.userId;
    
    if (!requestUser) {
      response.status(500).send({ message: `something went wrong` });
      return;
    }

  const deletedItem = await prisma.closetitems.delete({
    where: {
      id: parseInt(itemId),
    },
  });

  if (deletedItem) {
    response.send({ message: "Item deleted successfully" });
  } else {
    response.status(404).send({ message: "Item not found" });
  }
});

//GET "/outfits"
app.get("/outfits", AuthMiddleware, async (request: AuthRequest, response) => {
  const requestUser = request.userId;

  if (!requestUser) {
    response.status(500).send({ message: `something went wrong` });
    return;
  }

  console.log;
  const outfits = await prisma.outfits.findMany({
    where: {
      userId: requestUser,
    },
    include: {
      clothingItem: {
        select: {
          id: true,
          type: true,
          name: true,
          imgUrl: true,
        },
      },
    },
  });
  if (outfits) {
    response.send(outfits);
  } else {
    response.status(404).send({ message: "Item not found" });
  }
});

//GET "/outfit/recommendation"
const recommendationQueryValidator = z.object({
  // temp: z.string(),
  // condition: z.string(),
  city: z.string(),
  country: z.string(),
});

const WeatherForecastDayValidator = z
  .object({
    datetimeStr: z.string(), // string of date e.g. "2023-09-02T00:00:00+02:00"
    datetime: z.number(), //milliseconds since epoch
    icon: z.string(), //name of icon, e.g. partly-cloudy-day More info: https://www.visualcrossing.com/resources/documentation/weather-api/defining-icon-set-in-the-weather-api/
    temp: z.number(), //mean or avg temp
    mint: z.number(), //min temp
    maxt: z.number(), //max temp
    conditions: z.string(), //Description of weather
    pop: z.number(), //Chance Precipitation/rain (%)
  })
  .partial();

const WeatherForecastValidator = z.object({
  name: z.string(), //Name of location, e.g. Utrecht
  value: z.array(WeatherForecastDayValidator), //today's and next days forecast
  currentCondition: z
    .object({
      //currently (now) the temperature and icon's condition
      temp: z.number(),
      icon: z.string(),
    })
    .partial(),
});

type WeatherForecastDay = z.infer<typeof WeatherForecastDayValidator>;

app.get(
  "/outfit/recommendation",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const requestUser = req.userId;

    if (!requestUser) {
      res.status(500).send({ message: `User not logged in` });
      return;
    }

    const parsedQuery = recommendationQueryValidator.safeParse(req.query);
    // Check query parameters (maybe amount of days)
    if (!parsedQuery.success) {
      res.status(400).send(parsedQuery.error.flatten());
    } else {
      // Make API request to weather API to get the weather condition and temperatures
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locationMode=single&locations=${parsedQuery.data.city},${parsedQuery.data.country}&aggregateHours=24&unitGroup=metric&shortColumnNames=true&forecastDays=7&iconSet=icons1&contentType=json&key=${apiKeys.weathervisualcrossing}`
      );

      console.log(response.data);
      const weatherData = WeatherForecastValidator.safeParse(
        response.data.location
      );

      if (!weatherData.success) {
        res.status(500).send(weatherData.error.flatten());
      } else {
        // Filter which categories should be considered for each day
        const daysCategoriesRecommendation = weatherData.data.value.map(
          (day: WeatherForecastDay) => {
            return categoryRecommendation(day.temp, day.icon);
          }
        );

        // Use reduce function to combine all the categoriesRecommendation for each day
        // result is what is the outcome of the reduce function, in this case just 1 array will all categories
        // element is each array from daily recommendation - we loop throught them in the reduce function
        const weekCategoriesRecommendationWithDuplicates =
          daysCategoriesRecommendation.reduce(
            (result: string[], element: string[]) => {
              return result.concat(element);
            },
            []
          );
        const weekCategoriesRecommendation = [
          ...new Set(weekCategoriesRecommendationWithDuplicates),
        ];
        // Get clothes from DB that match the category
        const availableClosetItems = await prisma.closet.findMany({
          where: {
            userId: requestUser,
          },
          include: {
            items: {
              select: {
                type: true,
                name: true,
                id: true,
              },
              where: {
                name: { in: weekCategoriesRecommendation },
                outfit: { is: null },
              },
            },
          },
        });
        console.log(availableClosetItems);
        res.send(availableClosetItems);
      }

      // Generate the outfits

      // Return the outfits

      // Use this to filter the outfit of the users and then generate outfits and send them back
      // res.send(categories);
      // res.send(response.data);
    }
  }
);

//-----------------------------------////-----------------------------------////-----------------------------------////-----------------------------------////-----------------------------------//
// //GET "/category"
// app.get("/category", async (request, response) => {
//   const category = await prisma.category.findMany({
//     select: {
//       id: true,
//       type: true,
//       name: true,
//       imgUrl: true,
//       max_temp: true,
//       min_temp: true,
//       isRain: true,
//       isSporty: true,
//       isWarm: true,
//       outfit: {
//         select: {
//           id: true,
//           imgUrl: true,
//         },
//       },
//     },
//   });
//   response.send(category);
// });

// //GET "/Category/[categoryId]"
// app.get("/Category/:id", async (request, response) => {
//   const categoryId = parseInt(request.params.id);
//   if (isNaN(categoryId)) {
//     response.status(400).send({
//       message: `Requested ID needs to be a number.`,
//     });
//   } else {
//     try {
//       const categoryFromDatebase = await prisma.category.findUnique({
//         where: {
//           id: categoryId,
//         },
//         select: {
//           id: true,
//           type: true,
//           name: true,
//           imgUrl: true,
//           max_temp: true,
//           min_temp: true,
//           isRain: true,
//           isSporty: true,
//           isWarm: true,
//           outfit: {
//             select: {
//               id: true,
//               imgUrl: true,
//             },
//           },
//         },
//       });
//       if (!categoryFromDatebase) {
//         response
//           .status(404)
//           .send({ message: `Cannot find category with ID ${categoryId}.` });
//       } else {
//         response.send(categoryFromDatebase);
//       }
//     } catch (error) {
//       response.status(500).send(`Something went wrong.`);
//     }
//   }
// });

// ///GET "/outfit"
// app.get(
//     "/outfit",
//     AuthMiddleware,
//     async (request: AuthRequest, response) => {
//       const requestedUser = request.userId;

//       if (!requestedUser) {
//         response.status(500).send({ message: "Something went wrong" });
//         return;
//       }

//       const myOutfit = await prisma.outfits.findMany({
//         where: {
//           userId: requestedUser,
//         },
//         include: {
//           category: {
//             select: {
//               id: true,
//               name: true,
//               imgUrl: true,

//             },
//           },
//           user: {
//             select: {
//               id: true,
//               username: true,
//             },
//           },
//         },
//       });

//       if (!request.userId) {
//         response.status(500).send("Something went wrong");
//         return;
//       }
//       response.send(myOutfit);
//     }
//   );
