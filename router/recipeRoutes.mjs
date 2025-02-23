import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import * as recipeUtils from '../utils/recipeUtils.mjs';

const recipeRouter = express.Router();
recipeRouter.use(express.json());

const recipes = [
  //noen jalla oppskrifter
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
    }, {
      id: 3,
      title: "Beef Stir Fry",
      servings: 4,
      cookingTime: 35,
      difficulty: "medium",
      mealType: "dinner",
      nationality: "chinese",
      ingredients: [
        { "name": "beef strips", "amount": "500", "unit": "g" },
        { "name": "broccoli", "amount": "2", "unit": "cups" },
      ]
    },
    {
      id: 4,
      title: "Beef Wellington",
      servings: 6,
      cookingTime: 120,
      difficulty: "hard",
      mealType: "dinner",
      nationality: "british",
      ingredients: [
        { "name": "beef tenderloin", "amount": "1", "unit": "kg" },
        { "name": "prosciutto", "amount": "8", "unit": "slices" },
        { "name": "puff pastry", "amount": "500", "unit": "g" },
      ]
    }
];

recipeRouter.get("/", (req, res) => {
  const searchCriteriaExists = Object.keys(req.query).length > 0;

  if(!searchCriteriaExists){
    return res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
  }

  const findRecipe = recipeUtils.searchRecipes(recipes, req.query);
  if(findRecipe){
    res.status(HTTP_CODES.SUCCESS.OK).send(findRecipe).end();
  } else {
    res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
  }

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