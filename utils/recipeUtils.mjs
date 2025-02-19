export const findRecipe = (aCollectionOfRecipes, aRecipeID) => {
        const idToFind = parseInt(aRecipeID);
        const recipe = aCollectionOfRecipes.find(recipe => recipe.id === idToFind);
    return recipe;
}

export const createNewRecipe = (aCollectionOfRecipes, aName) => {
    
    const existingIds = aCollectionOfRecipes.map(recipe => recipe.id);
    const newId = Math.max(...existingIds) + 1;

        const newRecipe = {
            id: newId,
            title: aName
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