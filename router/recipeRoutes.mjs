import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import StoreRecipeRecord from '../data/recipeRecordStore.mjs';
import RecipeService from '../serviceLayer/recipeService.mjs';
import { validateRecipeRequest } from '../modules/validateRecipeRequest.mjs';
import standardizePropertyNames from '../modules/standardizedPropertyName.mjs';


const recipeRouter = express.Router();
recipeRouter.use(express.json());


const recipeRecord = new StoreRecipeRecord();
const recipeService = new RecipeService(recipeRecord);


recipeRouter.get("/", async (req, res) => {
  const searchCriteriaExists = Object.keys(req.query).length > 0;

  if(!searchCriteriaExists){

    const getAllRecipes = await recipeService.readAllRecipes();
    console.log(getAllRecipes);
    return res.status(HTTP_CODES.SUCCESS.OK).json(getAllRecipes);

  } else {
    const searchCriteria = req.query;
    console.log('Processed Search Criteria:', searchCriteria);
    const findRecipes = await recipeService.searchForRecipe(searchCriteria);
      if(findRecipes.length > 0){
        console.log(findRecipes);
        res.status(HTTP_CODES.SUCCESS.OK).json(findRecipes);
      } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
          .send({message:"No recipes found with your criteria."})
            .end();

      }
  }
})

recipeRouter.get("/:id", async (req, res) => {
  console.log(req.query)
    const id = req.query.id;
    console.log("Recipe ID requested:", id);
    const recipe = await recipeService.readRecipeById(id);

    if(recipe){
      res.status(HTTP_CODES.SUCCESS.OK).json(recipe);
    } else {
      res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({message: `No recipe with id ${id} found.`}).end();
    }
});


recipeRouter.post("/", validateRecipeRequest, async (req, res) => {
  try{
    const recipeData = req.body;

    const saveRecipe = await recipeService.createRecipe(recipeData);

    res.status(HTTP_CODES.SUCCESS.CREATED).send(saveRecipe).end();
  }catch(error){
    console.error("Error creating recipe:", error);
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT)
      .send({ message: error.message })
      .end();
  }
});

recipeRouter.patch("/:id", standardizePropertyNames, async (req, res) => {
  const id = req.params.id;
  const recipeChanges = req.body;
  console.log("Updating recipe:", id, recipeChanges);

    const newRecipe = await recipeService.changeExistingRecipe(id, recipeChanges);
    if(newRecipe){
    res.status(HTTP_CODES.SUCCESS.ACCEPTED).send(newRecipe).end();
  } else {
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT).send({message: `No recipe with ${id} found.`}).end();
  }
});

recipeRouter.delete("/:id", async (req, res) => {
  const recipeId = req.params.id;
  
  const recipeToDelete = await recipeService.deleteRecipe(recipeId);

  if(recipeToDelete){
    res.status(HTTP_CODES.SUCCESS.NO_CONTENT).send({
      message: `Recipe "${recipeId}" was deleted`,
    }).end();
  } else {
    res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send().end();
  }
})

export default recipeRouter;