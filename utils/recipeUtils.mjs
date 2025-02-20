export const findRecipe = (aCollectionOfRecipes, aRecipeID) => {
        const idToFind = parseInt(aRecipeID);
        const recipe = aCollectionOfRecipes.find(recipe => recipe.id === idToFind);
    return recipe;
}

export const createNewRecipe = (aCollectionOfRecipes, aNewRecipe) => {

    const validDifficulty = ["easy", "medium", "hard"];
    const validMealType = ["breakfast", "lunch", "dinner"];

    if (!aNewRecipe.title || !aNewRecipe.difficulty || !aNewRecipe.mealType) {
        throw new Error("Cannot create recipe: title, difficulty, and mealType are mandatory fields");
    }
    
    if (!validDifficulty.includes(aNewRecipe.difficulty)) {
        throw new Error(`Please choose a difficulty. Must be one of: ${validDifficulty.join(', ')}`);
    }

    if (!validMealType.includes(aNewRecipe.mealType)) {
        throw new Error(`Gotta have a mealtype, man. Must be one of: ${validMealType.join(', ')}`);
    }

    const existingIds = aCollectionOfRecipes.map(recipe => recipe.id);
    const newId = Math.max(...existingIds) + 1;

        const newRecipe = {
            id: newId,
            ...aNewRecipe
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