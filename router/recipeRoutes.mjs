import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import * as recipeUtils from '../utils/recipeUtils.mjs';

const recipeRouter = express.Router();
recipeRouter.use(express.json());


const recipes = [
    {
      id: 0,
      title: "Pasta with Tomato Sauce",
      servings: 2,
      cookingTime: 30,
      difficulty: "easy",
      mealType: "dinner",
      nationality: "italian",
    },
    {
      id: 1,
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
    const recipe = recipeUtils.findRecipe(recipes, id);

    if(recipe){
      res.status(HTTP_CODES.SUCCESS.OK).send(recipe).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({message: `No recipe with id ${id} found.`}).end();
    }
});

recipeRouter.post("/", (req, res) => {
  const recipeName = req.body.title;
  
  recipeUtils.createNewRecipe(recipeName, recipes);
  res.status(HTTP_CODES.SUCCESS.CREATED).send(recipes).end();
});

recipeRouter.patch("/:id", (req, res) => {
  const id = req.params.id;
  const recipeChanges = req.body;

  const recipeToChange = recipeUtils.findRecipe(recipes, id);

  if(recipeToChange){

  }

})



export default recipeRouter;