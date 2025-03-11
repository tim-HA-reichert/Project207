import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import Recipe from '../models/recipeModel.mjs';
import StoreRecipeRecord from '../data/recipeRecordStore.mjs';
import RecipeService from '../serviceLayer/recipeService.mjs';

import { 
  findRecipeById, 
  searchRecipes, 
  createNewRecipe, 
  changeExistingRecipe, 
  deleteRecipe 
} from '../utils/recipe/index.mjs';


const recipeRouter = express.Router();
recipeRouter.use(express.json());

const recipes = [
];

const recipeRecord = new StoreRecipeRecord();
const recipeService = new RecipeService(recipeRecord);


recipeRouter.get("/", async (req, res) => {
  const searchCriteriaExists = Object.keys(req.query).length > 0;

  console.log(req.query);

  if(!searchCriteriaExists){

    const getAllRecipes = await recipeService.readAllRecipes();
    return res.status(HTTP_CODES.SUCCESS.OK).send(getAllRecipes).end();

  } else {
    const searchCriteria = req.query;
    console.log('Processed Search Criteria:', searchCriteria);
    const findRecipes = await recipeService.searchForRecipe(searchCriteria);
      if(findRecipes.length > 0){
        res.status(HTTP_CODES.SUCCESS.OK).send(findRecipes).end();
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

    const saveRecipe = await recipeService.createRecipe(recipeData);

    res.status(HTTP_CODES.SUCCESS.CREATED).json(saveRecipe);
  }catch(error){
    console.error("Error creating recipe:", error);
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT)
      .send({ message: error.message })
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

recipeRouter.delete("/:id", async (req, res) => {
  const recipeId = req.params.id;
  
  const recipeToDelete = await recipeService.deleteRecipe(recipeId);

  if(recipeToDelete){
    res.status(HTTP_CODES.SUCCESS.NO_CONTENT).end();
  } else {
    res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send().end();
  }
})

//#region old delete code
/* 
recipeRouter.delete("/:id", (req, res) => {
    const id = req.params.id;
    const originalRecipeListLength = recipes.length;

    deleteRecipe(recipes, id);

    if(recipes.length < originalRecipeListLength){
      res.status(HTTP_CODES.SUCCESS.NO_CONTENT).end();
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send().end();
    }
}) */
//#endregion

export default recipeRouter;