import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import { findRecipe } from '../utils/recipeUtils/findRecipe.mjs';
import { createNewRecipe } from '../utils/recipeUtils/createRecipe.mjs';

const recipeRouter = express.Router();
recipeRouter.use(express.json());


const recipes = [
    {
      id: 1,
      title: "Pasta with Tomato Sauce",
      servings: 2,
      cookingTime: 30,
      difficulty: "easy",
      mealType: "dinner",
      nationality: "italian",
    },
    {
      id: 2,
      title: "Simple Omelette",
      servings: 1,
      cookingTime: 10,
      difficulty: "easy",
      mealType: "breakfast",
      nationality: "french",
    }
];

recipeRouter.get("/", (req, res) => {
  res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
})

recipeRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const recipe = findRecipe(recipes, id);

    if(recipe){
      res.status(HTTP_CODES.SUCCESS.OK).send(recipe).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({message: `No recipe with id ${id} found.`}).end();
    }
});

recipeRouter.post("/", (req, res) => {
  const recipeID = req.body.id;
  const recipeName = req.body.title;

  createNewRecipe(recipeID, recipeName, recipes);

  res.status(HTTP_CODES.SUCCESS.CREATED).send(recipes).end();

});





export default recipeRouter;