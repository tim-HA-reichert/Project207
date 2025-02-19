
export const findRecipe = (aCollectionOfRecipes, aRecipeID) => {
    const idToFind = parseInt(aRecipeID);
    const recipe = aCollectionOfRecipes.find(recipe => recipe.id === idToFind);
    return recipe;
}