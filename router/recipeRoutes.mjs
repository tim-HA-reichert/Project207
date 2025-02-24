import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';

import { 
  findRecipeById, 
  searchRecipes, 
  createNewRecipe, 
  changeExistingRecipe, 
  deleteRecipe 
} from '../utils/recipe/index.mjs';


const recipeRouter = express.Router();
recipeRouter.use(express.json());

const difficulties = {
  easy: "easy",
  medium: "medium",
  hard: "hard"
}

const mealTypes = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "dinner"
}

const recipes = [
  //noen jalla oppskrifter
    {
      id: 1,
      title: "Pasta with Tomato Sauce",
      servings: 2,
      cookingTime: 30,
      difficulty: difficulties.easy,
      mealType: mealTypes.dinner,
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
      difficulty: difficulties.easy,
      mealType: mealTypes.breakfast,
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
      difficulty: difficulties.medium,
      mealType: mealTypes.dinner,
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
      difficulty: difficulties.hard,
      mealType: mealTypes.dinner,
      nationality: "british",
      ingredients: [
        { "name": "beef tenderloin", "amount": "1", "unit": "kg" },
        { "name": "prosciutto", "amount": "8", "unit": "slices" },
        { "name": "puff pastry", "amount": "500", "unit": "g" },
        { "name": "butter", "amount": "1", "unit": "tbsp" }
      ]
    }
];

recipeRouter.get("/", (req, res) => {
  const searchCriteriaExists = Object.keys(req.query).length > 0;

  if(!searchCriteriaExists){
    return res.status(HTTP_CODES.SUCCESS.OK).send(recipes).end();
  } else {

    const findRecipe = searchRecipes(recipes, req.query);
      if(findRecipe.length > 0){
        res.status(HTTP_CODES.SUCCESS.OK).send(findRecipe).end();
      } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
          .send({message:"No recipes found with your criteria."})
            .end();
      }
  }
})

recipeRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const recipe = findRecipeById(recipes, id);

    if(recipe){
      res.status(HTTP_CODES.SUCCESS.OK).send(recipe).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({message: `No recipe with id ${id} found.`}).end();
    }
});

recipeRouter.post("/", (req, res) => {
  const newRecipe = req.body;
  
  createNewRecipe(recipes, newRecipe, difficulties, mealTypes);
  res.status(HTTP_CODES.SUCCESS.CREATED).send(recipes).end();
});

recipeRouter.patch("/:id", (req, res) => {
  const id = req.params.id;
  const recipeChanges = req.body;

  const recipeToChange = findRecipeById(recipes, id);
  
  if(recipeToChange){
    const updatedRecipe = changeExistingRecipe(recipes, id, recipeChanges);

    res.status(HTTP_CODES.SUCCESS.ACCEPTED).send(updatedRecipe).end();
  } else {
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT).send({message: `Please enter a valid ID.`}).end();
  }
});

recipeRouter.delete("/:id", (req, res) => {
    const id = req.params.id;
    const originalRecipeListLength = recipes.length;

    deleteRecipe(recipes, id);

    if(recipes.length < originalRecipeListLength){
      res.status(HTTP_CODES.SUCCESS.NO_CONTENT).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send().end();
    }
})


export default recipeRouter;