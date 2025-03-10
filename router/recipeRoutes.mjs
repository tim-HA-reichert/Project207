import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import * as recipeDB from '../data/recipeRecordStore.mjs'

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


recipeRouter.post("/", async (req, res) => {
  try{
    const recipeData = req.body;
    const newRecipe = createNewRecipe(recipeData, difficulties, mealTypes);

    const addNewRecipe = await recipeDB.create(newRecipe);

    res.status(HTTP_CODES.SUCCESS.CREATED).json(addNewRecipe);
  }catch(error){
    console.error("Error creating recipe:", error);
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT)
      .json({ message: error.message })
      .end();
  }
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