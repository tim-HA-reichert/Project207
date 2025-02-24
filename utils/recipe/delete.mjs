export const deleteRecipe = (aCollectionOfRecipes, recipeId) => {
    const id = parseInt(recipeId);
    const recipeIndex = aCollectionOfRecipes.findIndex(recipe => recipe.id === id);

    if(recipeIndex !== -1){
        aCollectionOfRecipes.splice(recipeIndex, 1);
    }

    return aCollectionOfRecipes;
}