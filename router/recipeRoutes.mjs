import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import * as recipeUtils from '../utils/recipeUtils.mjs';

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
      ingredients: [
        { "name": "pasta", "amount": "200", "unit": "g" },
        { "name": "crushed tomatoes", "amount": "400", "unit": "g" }
      ]
    },
    {
      id: 2,
      title: "Simple Omelette",
      servings: 1,
      cookingTime: 10,
      difficulty: "easy",
      mealType: "breakfast",
      nationality: "french",
      ingredients: [
        { "name": "eggs", "amount": "2", "unit": "" },
        { "name": "butter", "amount": "1", "unit": "tbsp" }
      ],
    }
];

recipeRouter.get("/", (req, res) => {
  console.log(recipes)

  const searchCriteriaExists = Object.keys(req.query).length > 0;

  if(!searchCriteriaExists){
    return res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
  }

  res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
})

recipeRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const recipe = recipeUtils.findRecipeById(recipes, id);

    if(recipe){
      res.status(HTTP_CODES.SUCCESS.OK).send(recipe).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({message: `No recipe with id ${id} found.`}).end();
    }
});

recipeRouter.post("/", (req, res) => {
  const newRecipe = req.body;
  
  recipeUtils.createNewRecipe(recipes, newRecipe);
  res.status(HTTP_CODES.SUCCESS.CREATED).send(recipes).end();
});

recipeRouter.patch("/:id", (req, res) => {
  const id = req.params.id;
  const recipeChanges = req.body;

  const recipeToChange = recipeUtils.findRecipeById(recipes, id);
  
  if(recipeToChange){
    const updatedRecipe = recipeUtils.changeExistingRecipe(recipes, id, recipeChanges);

    res.status(HTTP_CODES.SUCCESS.ACCEPTED).send(updatedRecipe).end();
  } else {
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT).send({message: `Please enter a valid ID.`}).end();
  }
});

recipeRouter.delete("/:id", (req, res) => {
    const id = req.params.id;
    const originalRecipeListLength = recipes.length;

    recipeUtils.deleteRecipe(recipes, id);

    if(recipes.length < originalRecipeListLength){
      res.status(HTTP_CODES.SUCCESS.NO_CONTENT).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send().end();
    }
})


export default recipeRouter;