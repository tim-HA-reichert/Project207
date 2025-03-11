export const changeExistingRecipe = (aCollectionOfRecipes, recipeId, recipeChanges) => {

    const id = parseInt(recipeId);
    const recipeIndex = aCollectionOfRecipes.findIndex(recipe => recipe.id === id);

    if (recipeIndex === -1) {
        throw new Error(`No recipe with id ${id} found`);
    }

        aCollectionOfRecipes[recipeIndex] = {
            ...aCollectionOfRecipes[recipeIndex],
            ...recipeChanges,
            id: id
        }

    return aCollectionOfRecipes[recipeIndex];
}


export const applyRecipeChanges = (existingRecipe, recipeChanges) => {
    if (!existingRecipe) {
        throw new Error('No recipe provided to update');
    }
    
    const updatedRecipe = {
        ...existingRecipe,
        ...recipeChanges,
    };

    return updatedRecipe;
};