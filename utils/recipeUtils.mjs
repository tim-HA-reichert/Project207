export const findRecipeById = (aCollectionOfRecipes, aRecipeID) => {
        const idToFind = parseInt(aRecipeID);
        const recipe = aCollectionOfRecipes.find(recipe => recipe.id === idToFind);
    return recipe;
}

export const searchRecipes = (aCollectionOfRecipes, searchParams) => {
   return aCollectionOfRecipes.filter(recipe => {
      for (const [searchField, searchValue] of Object.entries(searchParams)) {

        if(searchField === "ingredients"){
            const searchIngredients = searchValue.split(",")
                .map(ingredient => ingredient.trim().toLowerCase());

            const hasIngredient = searchIngredients.every(ingredient => 
                    recipe.ingredients.some(
                        element => element.name.toLowerCase().includes(searchIngredients)
            )
        );
            if(!hasIngredient){
                return false
            } 
                continue
        }
        
        const valueInRecipe = String(recipe[searchField]).toLowerCase();
        const valueToFind = String(searchValue).toLowerCase();
        
        if (!valueInRecipe.includes(valueToFind)) {
          return false;
        }
      }
      return true
    });
  };


export const createNewRecipe = (aCollectionOfRecipes, aNewRecipe, difficulties, mealTypes) => {

    const validDifficulties = Object.values(difficulties);
    const validMealType = Object.values(mealTypes);

    if (!aNewRecipe.title || !aNewRecipe.difficulty || !aNewRecipe.mealType) {
        throw new Error("Cannot create recipe: title, difficulty, and mealType are mandatory fields");
    }
    
    if (!validDifficulties.includes(aNewRecipe.difficulty)) {
        throw new Error(`Please choose a difficulty. Must be one of: ${validDifficulty.join(', ')}`);
    }

    if (!validMealType.includes(aNewRecipe.mealType)) {
        throw new Error(`Gotta have a mealtype, man. Must be one of: ${validMealType.join(', ')}`);
    }

    if (aNewRecipe.ingredients) {
        if (!Array.isArray(aNewRecipe.ingredients)) {
            throw new Error("Ingredients must be an array");
        }
    }


    const existingIds = aCollectionOfRecipes.map(recipe => recipe.id);
    const newId = Math.max(...existingIds) + 1;

        const newRecipe = {
            id: newId,
            title: aNewRecipe.title,
            servings: aNewRecipe.servings,
            cookingTime: aNewRecipe.cookingTime,
            difficulty: aNewRecipe.difficulty,
            mealType: aNewRecipe.mealType,
            nationality: aNewRecipe.nationality,
            ingredients: aNewRecipe.ingredients || []
        }

        aCollectionOfRecipes.push(newRecipe);
    return aCollectionOfRecipes;
}


export const changeExistingRecipe = (aCollectionOfRecipes, recipeId, recipeChanges) => {

    const id = parseInt(recipeId);
    const recipeIndex = aCollectionOfRecipes.findIndex(recipe => recipe.id === id);

        aCollectionOfRecipes[recipeIndex] = {
            ...aCollectionOfRecipes[recipeIndex],
            ...recipeChanges,
            id: id
        }

    return aCollectionOfRecipes[id]
}


export const deleteRecipe = (aCollectionOfRecipes, recipeId) => {
    const id = parseInt(recipeId);
    const recipeIndex = aCollectionOfRecipes.findIndex(recipe => recipe.id === id);

    if(recipeIndex !== -1){
        aCollectionOfRecipes.splice(recipeIndex, 1);
    }

    return aCollectionOfRecipes;
}