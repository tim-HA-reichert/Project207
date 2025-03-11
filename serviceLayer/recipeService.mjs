import Recipe from '../models/recipeModel.mjs';
import StoreRecipeRecord from '../data/recipeRecordStore.mjs';

import { 
    findRecipeById, 
    searchRecipes, 
    validateRecipeData, 
    applyRecipeChanges, 
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
      const validatedData = validateRecipeData(recipeData, this.difficulties, this.mealTypes);

      const newRecipe = new Recipe(validatedData);
      
      const saveRecipe = this.recipeRecord.create(newRecipe.recipeData());

    return await saveRecipe;
  }
  
  async readAllRecipes() {
    return await this.recipeRecord.readAll();
  }
  
  async searchForRecipe(searchCriteria) {
    console.log("Looking for recipe with criteria:", searchCriteria);
  
    const searchTerm = searchCriteria.search;
  
    if (!searchTerm) {
      return await this.readAllRecipes();
    }
  
    const searchTerms = searchTerm
        .split(/[\s,;|&]+/)
        .map(term => term.trim())  
        .filter(Boolean);         
  
    console.log("Search Terms:", searchTerms);
  
    if (searchTerms.length === 0) {
      return await this.readAllRecipes();
    }
    return await this.recipeRecord.searchFor(searchTerms);
  }
  
  async deleteRecipe(recipeId){
    return await this.recipeRecord.remove(recipeId);
  }

  async changeExistingRecipe(recipeId, changes){
    const originalRecipe = await this.recipeRecord.readById(recipeId)

    if(!originalRecipe || originalRecipe == 0){
        throw new Error(`No recipe with ${recipeId} found`);
    }
    
    const updatedRecipe = applyRecipeChanges(originalRecipe, changes);

    const validatedRecipeChanges = validateRecipeData(updatedRecipe, this.difficulties, this.mealTypes);


    return await this.recipeRecord.update(recipeId, validatedRecipeChanges);
  }
  
}