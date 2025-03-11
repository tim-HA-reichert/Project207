import Recipe from '../models/recipeModel.mjs';
import StoreRecipeRecord from '../data/recipeRecordStore.mjs';

import { 
    findRecipeById, 
    searchRecipes, 
    createNewRecipe, 
    changeExistingRecipe, 
    deleteRecipe 
  } from '../utils/recipe/index.mjs';

export default class RecipeService {
  constructor(recipeRecord) {
    this.recipeRecord = recipeRecord;
 
  this.difficulties = {
    easy: "easy",
    medium: "medium",
    hard: "hard"
  }
  
  this.mealTypes = {
    breakfast: "breakfast",
    lunch: "lunch",
    dinner: "dinner"
  }
}

  async createRecipe(recipeData) {
      const validatedData = createNewRecipe(recipeData, this.difficulties, this.mealTypes);

      const newRecipe = new Recipe(validatedData);
      
      const saveRecipe = this.recipeRecord.create(newRecipe.recipeData());

    return await saveRecipe;
  }
  
  async readAllRecipes() {
    return await this.recipeRecord.readAll();
  }
  
  async searchForRecipe(searchCriteria) {
    return await this.recipeRecord.searchFor(searchCriteria);
  }
  
}