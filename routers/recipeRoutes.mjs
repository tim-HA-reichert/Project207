import express from 'express';

const recipeRouter = express.Router();

const recipes = [
    {
      id: 1,
      title: "Pasta with Tomato Sauce",
      servings: 2,
      cookingTime: 30,
      difficulty: "easy",
      ingredients: [
        { name: "pasta", amount: "200", unit: "g" },
        { name: "crushed tomatoes", amount: "400", unit: "g" },
        { name: "olive oil", amount: "2", unit: "tbsp" }
      ],
      instructions: [
        "Boil pasta according to package instructions",
        "Heat olive oil and add tomatoes",
        "Mix sauce with pasta and serve"
      ],
      nationality: "italian",
      categories: ["pasta", "quick"]
    },
    {
      id: 2,
      title: "Simple Omelette",
      servings: 1,
      cookingTime: 10,
      difficulty: "easy",
      ingredients: [
        { name: "eggs", amount: "2", unit: "" },
        { name: "butter", amount: "1", unit: "tbsp" },
        { name: "salt", amount: "1", unit: "pinch" }
      ],
      instructions: [
        "Beat eggs in a bowl",
        "Melt butter in pan over medium heat",
        "Pour in eggs and cook until set"
      ],
      nationality: "french",
      categories: ["breakfast", "quick"]
    }
  ];



export default recipeRouter;