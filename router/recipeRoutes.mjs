import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';

const recipeRouter = express.Router();

const recipes = [
    {
      id: 1,
      title: "Pasta with Tomato Sauce",
      servings: 2,
      cookingTime: 30,
      difficulty: "easy",
      mealType: "dinner",
      ingredients: [
        { "name": "pasta", "amount": "200", "unit": "g" },
        { "name": "crushed tomatoes", "amount": "400", "unit": "g" },
        { "name": "olive oil", "amount": "2", "unit": "tbsp" }
      ],
      instructions: [
        "Boil pasta according to package instructions",
        "Heat olive oil and add tomatoes",
        "Mix sauce with pasta and serve"
      ],
      nationality: "italian"
    },
    {
      id: 2,
      title: "Simple Omelette",
      servings: 1,
      cookingTime: 10,
      difficulty: "easy",
      mealType: "breakfast",
      ingredients: [
        { "name": "eggs", "amount": "2", "unit": "" },
        { "name": "butter", "amount": "1", "unit": "tbsp" },
        { "name": "salt", "amount": "1", "unit": "pinch" }
      ],
      instructions: [
        "Beat eggs in a bowl",
        "Melt butter in pan over medium heat",
        "Pour in eggs and cook until set"
      ],
      nationality: "french"
    }
];


recipeRouter.get("/", (req, res) => {
  res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
})




export default recipeRouter;